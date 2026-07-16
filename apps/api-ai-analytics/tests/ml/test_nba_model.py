"""Unit tests for Next-Best-Action recommendation model."""

import pytest

from app.ml.nba_model import predict


class TestNbaModelPredict:
    """Tests for nba_model.predict()."""

    def test_high_churn_high_clv_offers_discount(self):
        """High churn (>=0.7) + high CLV (>=500) → offer_discount."""
        features = {
            "churn_score": 0.85,
            "clv_prediction": 1200.0,
            "days_since_last_order": 10,
            "total_orders": 20,
            "ticket_count_last_90d": 0,
            "account_age_days": 365,
        }
        result = predict(features)
        assert result["action"] == "offer_discount"
        assert result["confidence"] == 0.85

    def test_high_churn_lower_clv_sends_reactivation(self):
        """High churn (>=0.7) + lower CLV (<500) → send_reactivation_campaign."""
        features = {
            "churn_score": 0.75,
            "clv_prediction": 200.0,
            "days_since_last_order": 10,
            "total_orders": 5,
            "ticket_count_last_90d": 0,
            "account_age_days": 100,
        }
        result = predict(features)
        assert result["action"] == "send_reactivation_campaign"
        assert result["confidence"] == 0.80

    def test_many_tickets_proactive_support(self):
        """3+ tickets in 90 days → proactive_support_outreach."""
        features = {
            "churn_score": 0.3,
            "clv_prediction": 400.0,
            "days_since_last_order": 10,
            "total_orders": 8,
            "ticket_count_last_90d": 4,
            "account_age_days": 200,
        }
        result = predict(features)
        assert result["action"] == "proactive_support_outreach"
        assert result["confidence"] == 0.75

    def test_dormant_low_churn_sends_recommendations(self):
        """Dormant (>60 days) + low churn (<0.5) → send_product_recommendations."""
        features = {
            "churn_score": 0.3,
            "clv_prediction": 400.0,
            "days_since_last_order": 90,
            "total_orders": 8,
            "ticket_count_last_90d": 1,
            "account_age_days": 200,
        }
        result = predict(features)
        assert result["action"] == "send_product_recommendations"
        assert result["confidence"] == 0.65

    def test_new_customer_onboarding(self):
        """New customer (<30 days, <=1 order) → send_onboarding_series."""
        features = {
            "churn_score": 0.1,
            "clv_prediction": 50.0,
            "days_since_last_order": 5,
            "total_orders": 1,
            "ticket_count_last_90d": 0,
            "account_age_days": 10,
        }
        result = predict(features)
        assert result["action"] == "send_onboarding_series"
        assert result["confidence"] == 0.70

    def test_high_clv_low_churn_premium_upgrade(self):
        """High CLV (>=1000) + low churn (<0.3) → offer_premium_upgrade."""
        features = {
            "churn_score": 0.1,
            "clv_prediction": 2000.0,
            "days_since_last_order": 10,
            "total_orders": 15,
            "ticket_count_last_90d": 0,
            "account_age_days": 400,
        }
        result = predict(features)
        assert result["action"] == "offer_premium_upgrade"
        assert result["confidence"] == 0.60

    def test_default_nurture_sequence(self):
        """No special signals → continue_nurture_sequence."""
        features = {
            "churn_score": 0.2,
            "clv_prediction": 300.0,
            "days_since_last_order": 20,
            "total_orders": 5,
            "ticket_count_last_90d": 1,
            "account_age_days": 100,
        }
        result = predict(features)
        assert result["action"] == "continue_nurture_sequence"
        assert result["confidence"] == 0.50

    def test_output_has_required_keys(self):
        """Every prediction result contains action, reason, and confidence."""
        test_cases = [
            {"churn_score": 0.9, "clv_prediction": 1000.0},
            {"churn_score": 0.9, "clv_prediction": 100.0},
            {"ticket_count_last_90d": 5},
            {"days_since_last_order": 90, "churn_score": 0.2},
            {"account_age_days": 10, "total_orders": 0},
            {"clv_prediction": 2000.0, "churn_score": 0.1},
            {},
        ]
        required_keys = {"action", "reason", "confidence"}
        for features in test_cases:
            result = predict(features)
            assert required_keys.issubset(result.keys()), (
                f"Missing keys in result for features={features}"
            )
            assert isinstance(result["action"], str)
            assert isinstance(result["reason"], str)
            assert isinstance(result["confidence"], float)
            assert 0.0 <= result["confidence"] <= 1.0

    def test_priority_churn_over_tickets(self):
        """High churn takes priority over ticket count."""
        features = {
            "churn_score": 0.8,
            "clv_prediction": 800.0,
            "ticket_count_last_90d": 5,
            "days_since_last_order": 10,
            "total_orders": 10,
            "account_age_days": 200,
        }
        result = predict(features)
        # High churn + high CLV should win over ticket count
        assert result["action"] == "offer_discount"

    def test_empty_features_triggers_onboarding(self):
        """Empty dict (defaults: age=0, orders=0) matches onboarding rule."""
        result = predict({})
        # account_age_days=0 < 30 and total_orders=0 <= 1 → onboarding
        assert result["action"] == "send_onboarding_series"
        assert result["confidence"] == 0.70
