from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas.customer_schemas import (
    CustomerFeatures,
    CustomerInsightsResponse,
    NextBestAction,
)


class TestCustomerFeatures:
    def test_valid_with_only_customer_id(self):
        features = CustomerFeatures(customer_id="cust_123")

        assert features.customer_id == "cust_123"
        assert features.days_since_last_order == 0
        assert features.order_frequency_trend == 0.0
        assert features.ticket_count_last_90d == 0
        assert features.account_age_days == 0
        assert features.total_orders == 0
        assert features.total_order_value == 0.0
        assert features.average_order_value == 0.0
        assert features.order_frequency_per_month == 0.0

    def test_valid_with_all_fields(self):
        features = CustomerFeatures(
            customer_id="cust_456",
            days_since_last_order=15,
            order_frequency_trend=1.5,
            ticket_count_last_90d=3,
            account_age_days=365,
            total_orders=20,
            total_order_value=5000.0,
            average_order_value=250.0,
            order_frequency_per_month=1.67,
        )

        assert features.customer_id == "cust_456"
        assert features.days_since_last_order == 15
        assert features.order_frequency_trend == 1.5
        assert features.ticket_count_last_90d == 3
        assert features.account_age_days == 365
        assert features.total_orders == 20
        assert features.total_order_value == 5000.0
        assert features.average_order_value == 250.0
        assert features.order_frequency_per_month == 1.67

    def test_model_dump(self):
        features = CustomerFeatures(
            customer_id="cust_789",
            days_since_last_order=7,
            total_orders=10,
        )
        dumped = features.model_dump()

        assert isinstance(dumped, dict)
        assert dumped["customer_id"] == "cust_789"
        assert dumped["days_since_last_order"] == 7
        assert dumped["total_orders"] == 10
        assert dumped["order_frequency_trend"] == 0.0


class TestNextBestAction:
    def test_valid_creation(self):
        nba = NextBestAction(
            action="send_discount",
            reason="Customer at risk of churning",
            confidence=0.85,
        )

        assert nba.action == "send_discount"
        assert nba.reason == "Customer at risk of churning"
        assert nba.confidence == 0.85

    def test_confidence_below_zero_raises(self):
        with pytest.raises(ValidationError) as exc_info:
            NextBestAction(
                action="send_discount",
                reason="Some reason",
                confidence=-0.1,
            )

        assert "confidence" in str(exc_info.value)

    def test_confidence_above_one_raises(self):
        with pytest.raises(ValidationError) as exc_info:
            NextBestAction(
                action="send_discount",
                reason="Some reason",
                confidence=1.1,
            )

        assert "confidence" in str(exc_info.value)


class TestCustomerInsightsResponse:
    @pytest.fixture
    def valid_nba(self):
        return NextBestAction(
            action="send_discount",
            reason="High churn risk",
            confidence=0.9,
        )

    @pytest.fixture
    def valid_response_data(self, valid_nba):
        return {
            "customer_id": "cust_001",
            "churn_score": 0.75,
            "clv_prediction": 1200.50,
            "next_best_action": valid_nba,
            "computed_at": datetime(2026, 7, 17, 12, 0, 0, tzinfo=timezone.utc),
        }

    def test_valid_creation(self, valid_response_data):
        response = CustomerInsightsResponse(**valid_response_data)

        assert response.customer_id == "cust_001"
        assert response.churn_score == 0.75
        assert response.clv_prediction == 1200.50
        assert response.next_best_action.action == "send_discount"
        assert response.cached is False

    def test_churn_score_below_zero_raises(self, valid_response_data):
        valid_response_data["churn_score"] = -0.1

        with pytest.raises(ValidationError) as exc_info:
            CustomerInsightsResponse(**valid_response_data)

        assert "churn_score" in str(exc_info.value)

    def test_churn_score_above_one_raises(self, valid_response_data):
        valid_response_data["churn_score"] = 1.5

        with pytest.raises(ValidationError) as exc_info:
            CustomerInsightsResponse(**valid_response_data)

        assert "churn_score" in str(exc_info.value)

    def test_clv_prediction_below_zero_raises(self, valid_response_data):
        valid_response_data["clv_prediction"] = -100.0

        with pytest.raises(ValidationError) as exc_info:
            CustomerInsightsResponse(**valid_response_data)

        assert "clv_prediction" in str(exc_info.value)

    def test_serialization_deserialization_round_trip(self, valid_response_data):
        original = CustomerInsightsResponse(**valid_response_data)
        dumped = original.model_dump(mode="json")
        restored = CustomerInsightsResponse.model_validate(dumped)

        assert restored.customer_id == original.customer_id
        assert restored.churn_score == original.churn_score
        assert restored.clv_prediction == original.clv_prediction
        assert restored.next_best_action.action == original.next_best_action.action
        assert restored.next_best_action.confidence == original.next_best_action.confidence
        assert restored.computed_at == original.computed_at
        assert restored.cached == original.cached
