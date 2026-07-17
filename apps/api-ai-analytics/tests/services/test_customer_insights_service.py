"""Unit tests for CustomerInsightsService."""

from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.customer_schemas import (
    CustomerFeatures,
    CustomerInsightsResponse,
    NextBestAction,
)
from app.services.customer_insights_service import (
    CustomerInsightsService,
    CustomerNotFoundError,
)

CUSTOMER_ID = "cust-abc-123"


@pytest.fixture()
def mock_crm_client():
    client = AsyncMock()
    client.get_customer = AsyncMock()
    client.get_customer_orders = AsyncMock()
    return client


@pytest.fixture()
def mock_cache_repo():
    repo = AsyncMock()
    repo.get_insights = AsyncMock(return_value=None)
    repo.set_insights = AsyncMock()
    return repo


@pytest.fixture()
def mock_feature_repo():
    repo = AsyncMock()
    repo.save_feature_log = AsyncMock()
    return repo


@pytest.fixture()
def service(mock_crm_client, mock_cache_repo, mock_feature_repo):
    return CustomerInsightsService(
        crm_client=mock_crm_client,
        cache_repo=mock_cache_repo,
        feature_repo=mock_feature_repo,
    )


@pytest.fixture()
def sample_customer():
    return {
        "id": CUSTOMER_ID,
        "name": "Alice Test",
        "email": "alice@example.com",
        "createdAt": "2025-01-15T10:00:00Z",
        "ticketCount": 2,
    }


@pytest.fixture()
def sample_orders():
    return [
        {
            "id": "order-1",
            "totalAmount": 120.0,
            "orderDate": "2026-06-10T14:00:00Z",
        },
        {
            "id": "order-2",
            "totalAmount": 80.0,
            "orderDate": "2026-05-01T09:00:00Z",
        },
    ]


@pytest.fixture()
def cached_insights():
    return {
        "churn_score": 0.25,
        "clv_prediction": 450.0,
        "next_best_action": {
            "action": "continue_nurture_sequence",
            "reason": "Customer is stable",
            "confidence": 0.50,
        },
        "computed_at": "2026-07-16T12:00:00+00:00",
    }


# --- Test 1: Cache hit ---


async def test_cache_hit_returns_cached_response(
    service, mock_cache_repo, mock_crm_client, cached_insights
):
    """When cache has insights, return them with cached=True and skip CRM."""
    mock_cache_repo.get_insights.return_value = cached_insights

    result = await service.get_insights(CUSTOMER_ID)

    assert result.cached is True
    assert result.customer_id == CUSTOMER_ID
    assert result.churn_score == cached_insights["churn_score"]
    assert result.clv_prediction == cached_insights["clv_prediction"]
    assert result.next_best_action.action == "continue_nurture_sequence"
    assert result.next_best_action.confidence == 0.50

    # CRM should never be called on cache hit
    mock_crm_client.get_customer.assert_not_called()
    mock_crm_client.get_customer_orders.assert_not_called()


# --- Test 2: Cache miss — full flow ---


@patch("app.services.customer_insights_service.nba_model")
@patch("app.services.customer_insights_service.clv_model")
@patch("app.services.customer_insights_service.churn_model")
async def test_cache_miss_computes_and_returns_insights(
    mock_churn,
    mock_clv,
    mock_nba,
    service,
    mock_crm_client,
    mock_cache_repo,
    mock_feature_repo,
    sample_customer,
    sample_orders,
):
    """On cache miss: fetch CRM, run models, cache, log features, return cached=False."""
    mock_cache_repo.get_insights.return_value = None
    mock_crm_client.get_customer.return_value = sample_customer
    mock_crm_client.get_customer_orders.return_value = sample_orders

    mock_churn.predict.return_value = 0.15
    mock_clv.predict.return_value = 320.0
    mock_nba.predict.return_value = {
        "action": "send_product_recommendations",
        "reason": "Inactive but not churning",
        "confidence": 0.65,
    }

    result = await service.get_insights(CUSTOMER_ID)

    assert result.cached is False
    assert result.customer_id == CUSTOMER_ID
    assert result.churn_score == 0.15
    assert result.clv_prediction == 320.0
    assert result.next_best_action.action == "send_product_recommendations"
    assert result.next_best_action.confidence == 0.65
    assert isinstance(result.computed_at, datetime)

    # Verify CRM was called
    mock_crm_client.get_customer.assert_awaited_once_with(CUSTOMER_ID)
    mock_crm_client.get_customer_orders.assert_awaited_once_with(CUSTOMER_ID)

    # Verify models were called
    mock_churn.predict.assert_called_once()
    mock_clv.predict.assert_called_once()
    mock_nba.predict.assert_called_once()


# --- Test 3: Customer not found ---


async def test_customer_not_found_raises_error(
    service, mock_crm_client, mock_cache_repo
):
    """When CRM returns None for customer, raise CustomerNotFoundError."""
    mock_cache_repo.get_insights.return_value = None
    mock_crm_client.get_customer.return_value = None

    with pytest.raises(CustomerNotFoundError, match=CUSTOMER_ID):
        await service.get_insights(CUSTOMER_ID)

    # Should not attempt to fetch orders
    mock_crm_client.get_customer_orders.assert_not_called()


# --- Test 4: Feature building ---


async def test_build_features_with_known_data(service, sample_customer):
    """Test _build_features produces correct CustomerFeatures from known input."""
    orders = [
        {
            "id": "order-1",
            "totalAmount": 200.0,
            "orderDate": "2026-07-10T10:00:00Z",
        },
        {
            "id": "order-2",
            "totalAmount": 100.0,
            "orderDate": "2026-06-15T10:00:00Z",
        },
    ]

    features = service._build_features(CUSTOMER_ID, sample_customer, orders)

    assert isinstance(features, CustomerFeatures)
    assert features.customer_id == CUSTOMER_ID
    assert features.total_orders == 2
    assert features.total_order_value == 300.0
    assert features.average_order_value == 150.0
    assert features.account_age_days > 0
    assert features.ticket_count_last_90d == 2
    assert features.order_frequency_per_month > 0.0


async def test_build_features_no_orders(service, sample_customer):
    """Test _build_features with empty orders list."""
    features = service._build_features(CUSTOMER_ID, sample_customer, [])

    assert features.total_orders == 0
    assert features.total_order_value == 0.0
    assert features.average_order_value == 0.0
    assert features.days_since_last_order == 0
    assert features.order_frequency_per_month == 0.0


async def test_build_features_negative_trend_old_orders(service):
    """Test declining trend when orders are old but customer has history."""
    customer = {
        "id": CUSTOMER_ID,
        "createdAt": "2025-01-01T00:00:00Z",
        "ticketCount": 0,
    }
    # Last order > 60 days ago, 3+ orders → negative trend
    orders = [
        {"totalAmount": 50.0, "orderDate": "2026-01-10T00:00:00Z"},
        {"totalAmount": 50.0, "orderDate": "2026-02-10T00:00:00Z"},
        {"totalAmount": 50.0, "orderDate": "2026-03-10T00:00:00Z"},
    ]

    features = service._build_features(CUSTOMER_ID, customer, orders)

    assert features.order_frequency_trend == -0.3
    assert features.total_orders == 3


# --- Test 5: Full flow sets cache after computing ---


@patch("app.services.customer_insights_service.nba_model")
@patch("app.services.customer_insights_service.clv_model")
@patch("app.services.customer_insights_service.churn_model")
async def test_full_flow_caches_result(
    mock_churn,
    mock_clv,
    mock_nba,
    service,
    mock_crm_client,
    mock_cache_repo,
    mock_feature_repo,
    sample_customer,
    sample_orders,
):
    """After computing insights, set_insights is called with serialized response."""
    mock_cache_repo.get_insights.return_value = None
    mock_crm_client.get_customer.return_value = sample_customer
    mock_crm_client.get_customer_orders.return_value = sample_orders

    mock_churn.predict.return_value = 0.4
    mock_clv.predict.return_value = 600.0
    mock_nba.predict.return_value = {
        "action": "offer_discount",
        "reason": "High value at risk",
        "confidence": 0.85,
    }

    await service.get_insights(CUSTOMER_ID)

    mock_cache_repo.set_insights.assert_awaited_once()
    call_args = mock_cache_repo.set_insights.call_args
    assert call_args[0][0] == CUSTOMER_ID

    cached_data = call_args[0][1]
    assert cached_data["customer_id"] == CUSTOMER_ID
    assert cached_data["churn_score"] == 0.4
    assert cached_data["clv_prediction"] == 600.0
    assert cached_data["cached"] is False


# --- Test 6: Full flow saves feature log to MongoDB ---


@patch("app.services.customer_insights_service.nba_model")
@patch("app.services.customer_insights_service.clv_model")
@patch("app.services.customer_insights_service.churn_model")
async def test_full_flow_saves_feature_log(
    mock_churn,
    mock_clv,
    mock_nba,
    service,
    mock_crm_client,
    mock_cache_repo,
    mock_feature_repo,
    sample_customer,
    sample_orders,
):
    """After computing insights, feature log is saved to MongoDB."""
    mock_cache_repo.get_insights.return_value = None
    mock_crm_client.get_customer.return_value = sample_customer
    mock_crm_client.get_customer_orders.return_value = sample_orders

    mock_churn.predict.return_value = 0.2
    mock_clv.predict.return_value = 250.0
    mock_nba.predict.return_value = {
        "action": "continue_nurture_sequence",
        "reason": "Stable customer",
        "confidence": 0.50,
    }

    await service.get_insights(CUSTOMER_ID)

    mock_feature_repo.save_feature_log.assert_awaited_once()
    call_args = mock_feature_repo.save_feature_log.call_args
    assert call_args[0][0] == CUSTOMER_ID

    feature_dict = call_args[0][1]
    assert feature_dict["customer_id"] == CUSTOMER_ID
    assert "total_orders" in feature_dict
    assert "total_order_value" in feature_dict
    assert "days_since_last_order" in feature_dict
