"""Customer Insights service — orchestrates scoring pipeline."""

from datetime import datetime, timezone

from app.lib.crm_client import CrmClient
from app.ml import churn_model, clv_model, nba_model
from app.repositories.mongo.customer_feature_repository import (
    CustomerFeatureRepository,
)
from app.repositories.redis.customer_cache_repository import (
    CustomerCacheRepository,
)
from app.schemas.customer_schemas import (
    CustomerFeatures,
    CustomerInsightsResponse,
    NextBestAction,
)


class CustomerNotFoundError(Exception):
    """Raised when customer does not exist in CRM."""


class CrmUnavailableError(Exception):
    """Raised when CRM API is unreachable."""


class CustomerInsightsService:
    """Orchestrates churn, CLV, and NBA scoring for a customer."""

    def __init__(
        self,
        crm_client: CrmClient,
        cache_repo: CustomerCacheRepository,
        feature_repo: CustomerFeatureRepository,
    ) -> None:
        self._crm = crm_client
        self._cache = cache_repo
        self._features = feature_repo

    async def get_insights(
        self, customer_id: str
    ) -> CustomerInsightsResponse:
        """Get customer insights, using cache when available."""
        # 1. Check cache
        cached = await self._cache.get_insights(customer_id)
        if cached:
            return CustomerInsightsResponse(
                customer_id=customer_id,
                churn_score=cached["churn_score"],
                clv_prediction=cached["clv_prediction"],
                next_best_action=NextBestAction(**cached["next_best_action"]),
                computed_at=cached["computed_at"],
                cached=True,
            )

        # 2. Fetch from CRM
        customer = await self._crm.get_customer(customer_id)
        if customer is None:
            raise CustomerNotFoundError(
                f"Customer {customer_id} not found"
            )

        orders = await self._crm.get_customer_orders(customer_id)

        # 3. Build feature vector
        features = self._build_features(customer_id, customer, orders)

        # 4. Run ML models
        churn_score = churn_model.predict(features.model_dump())
        clv_prediction = clv_model.predict(features.model_dump())

        nba_input = features.model_dump()
        nba_input["churn_score"] = churn_score
        nba_input["clv_prediction"] = clv_prediction
        nba_result = nba_model.predict(nba_input)

        computed_at = datetime.now(timezone.utc)

        # 5. Build response
        response = CustomerInsightsResponse(
            customer_id=customer_id,
            churn_score=churn_score,
            clv_prediction=clv_prediction,
            next_best_action=NextBestAction(**nba_result),
            computed_at=computed_at,
            cached=False,
        )

        # 6. Cache result
        await self._cache.set_insights(
            customer_id, response.model_dump(mode="json")
        )

        # 7. Log features to MongoDB
        from app.core.config import get_settings
        settings = get_settings()
        await self._features.save_feature_log(
            customer_id,
            features.model_dump(),
            model_versions={
                "churn": settings.model_version_churn,
                "clv": settings.model_version_clv,
            }
        )

        return response

    def _build_features(
        self, customer_id: str, customer: dict, orders: list[dict]
    ) -> CustomerFeatures:
        """Build ML feature vector from CRM data."""
        now = datetime.now(timezone.utc)

        # Account age
        created_at = customer.get("createdAt") or customer.get("created_at")
        account_age_days = 0
        if created_at:
            try:
                created = datetime.fromisoformat(str(created_at).replace("Z", "+00:00"))
                account_age_days = (now - created).days
            except (ValueError, TypeError):
                pass

        # Order statistics
        total_orders = len(orders)
        total_order_value = 0.0
        last_order_date = None

        for order in orders:
            total_value = order.get("totalAmount") or order.get("total") or 0
            total_order_value += float(total_value)
            order_date_str = order.get("orderDate") or order.get("createdAt")
            if order_date_str:
                try:
                    order_date = datetime.fromisoformat(
                        str(order_date_str).replace("Z", "+00:00")
                    )
                    if last_order_date is None or order_date > last_order_date:
                        last_order_date = order_date
                except (ValueError, TypeError):
                    pass

        days_since_last_order = 0
        if last_order_date:
            days_since_last_order = (now - last_order_date).days

        average_order_value = (
            total_order_value / total_orders if total_orders > 0 else 0.0
        )

        # Order frequency per month
        order_frequency_per_month = 0.0
        if account_age_days > 0:
            months = max(account_age_days / 30.0, 1.0)
            order_frequency_per_month = total_orders / months

        # Simplified trend (no historical comparison yet)
        order_frequency_trend = 0.0
        if total_orders >= 3 and days_since_last_order > 60:
            order_frequency_trend = -0.3
        elif total_orders >= 3 and days_since_last_order < 30:
            order_frequency_trend = 0.2

        # Ticket count (from customer profile if available)
        ticket_count = customer.get("ticketCount") or customer.get(
            "ticket_count_last_90d", 0
        )

        return CustomerFeatures(
            customer_id=customer_id,
            days_since_last_order=days_since_last_order,
            order_frequency_trend=order_frequency_trend,
            ticket_count_last_90d=int(ticket_count),
            account_age_days=account_age_days,
            total_orders=total_orders,
            total_order_value=total_order_value,
            average_order_value=average_order_value,
            order_frequency_per_month=round(order_frequency_per_month, 2),
        )
