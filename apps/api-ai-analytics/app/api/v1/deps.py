"""Dependency injection for API v1 routes."""

from app.core.config import get_settings
from app.db.mongo import get_database
from app.db.redis import get_redis_client
from app.lib.crm_client import CrmClient
from app.repositories.mongo.customer_feature_repository import (
    CustomerFeatureRepository,
)
from app.repositories.redis.customer_cache_repository import (
    CustomerCacheRepository,
)
from app.services.customer_insights_service import CustomerInsightsService


def get_customer_insights_service() -> CustomerInsightsService:
    """Build and return CustomerInsightsService with all dependencies."""
    settings = get_settings()

    crm_client = CrmClient(
        base_url=settings.crm_api_base_url,
        service_token=settings.crm_service_token,
    )

    redis_client = get_redis_client()
    cache_repo = CustomerCacheRepository(redis_client)

    database = get_database()
    feature_repo = CustomerFeatureRepository(database)

    return CustomerInsightsService(
        crm_client=crm_client,
        cache_repo=cache_repo,
        feature_repo=feature_repo,
    )
