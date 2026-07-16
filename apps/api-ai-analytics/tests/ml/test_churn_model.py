"""Unit tests for churn risk prediction model."""

import pytest

from app.ml.churn_model import predict


class TestChurnModelPredict:
    """Tests for churn_model.predict()."""

    def test_active_customer_low_risk(self):
        """Active customer with recent orders and positive trend has low score."""
        features = {
            "days_since_last_order": 10,
            "order_frequency_trend": 0.5,
            "ticket_count_last_90d": 0,
            "account_age_days": 200,
            "total_orders": 15,
        }
        score = predict(features)
        assert score < 0.1

    def test_high_recency_risk(self):
        """Customer with 200 days since last order gets high recency contribution."""
        features = {
            "days_since_last_order": 200,
            "order_frequency_trend": 0.0,
            "ticket_count_last_90d": 0,
            "account_age_days": 365,
            "total_orders": 10,
        }
        score = predict(features)
        assert score >= 0.35

    def test_declining_frequency(self):
        """Declining order frequency (-0.6) adds 0.25 to score."""
        features = {
            "days_since_last_order": 10,
            "order_frequency_trend": -0.6,
            "ticket_count_last_90d": 0,
            "account_age_days": 200,
            "total_orders": 10,
        }
        score = predict(features)
        assert score >= 0.25

    def test_high_ticket_count(self):
        """5+ support tickets in 90 days adds 0.20 to score."""
        features = {
            "days_since_last_order": 10,
            "order_frequency_trend": 0.0,
            "ticket_count_last_90d": 5,
            "account_age_days": 200,
            "total_orders": 10,
        }
        score = predict(features)
        assert score >= 0.20

    def test_new_account_bonus_reduces_score(self):
        """New account (<30 days, <=1 order) gets 50% score reduction."""
        features = {
            "days_since_last_order": 100,
            "order_frequency_trend": -0.6,
            "ticket_count_last_90d": 5,
            "account_age_days": 20,
            "total_orders": 1,
        }
        # Same features but without new account bonus
        features_no_bonus = {
            **features,
            "account_age_days": 60,
            "total_orders": 5,
        }
        score_with_bonus = predict(features)
        score_without_bonus = predict(features_no_bonus)
        assert score_with_bonus == pytest.approx(score_without_bonus * 0.5, abs=0.01)

    def test_zero_orders_old_account_penalty(self):
        """Zero orders with account_age_days > 60 adds 0.20 penalty."""
        features = {
            "days_since_last_order": 0,
            "order_frequency_trend": 0.0,
            "ticket_count_last_90d": 0,
            "account_age_days": 90,
            "total_orders": 0,
        }
        score = predict(features)
        assert score >= 0.20

    def test_all_max_signals_combined(self):
        """All risk signals at maximum produce high score (capped at 1.0)."""
        features = {
            "days_since_last_order": 200,
            "order_frequency_trend": -0.8,
            "ticket_count_last_90d": 10,
            "account_age_days": 365,
            "total_orders": 0,
        }
        score = predict(features)
        # 0.35 + 0.25 + 0.20 + 0.20 (zero orders penalty) = 1.0
        assert score == 1.0

    def test_empty_dict_returns_zero(self):
        """Empty features dict returns 0.0 (all defaults are safe)."""
        score = predict({})
        assert score == 0.0

    def test_score_always_between_zero_and_one(self):
        """Score is always clamped to [0.0, 1.0] regardless of input."""
        extreme_features = {
            "days_since_last_order": 9999,
            "order_frequency_trend": -1.0,
            "ticket_count_last_90d": 100,
            "account_age_days": 5000,
            "total_orders": 0,
        }
        score = predict(extreme_features)
        assert 0.0 <= score <= 1.0

    def test_moderate_recency_61_to_90_days(self):
        """61-90 days since last order contributes 0.15."""
        features = {
            "days_since_last_order": 75,
            "order_frequency_trend": 0.0,
            "ticket_count_last_90d": 0,
            "account_age_days": 200,
            "total_orders": 5,
        }
        score = predict(features)
        assert score == pytest.approx(0.15)

    def test_moderate_recency_31_to_60_days(self):
        """31-60 days since last order contributes 0.08."""
        features = {
            "days_since_last_order": 45,
            "order_frequency_trend": 0.0,
            "ticket_count_last_90d": 0,
            "account_age_days": 200,
            "total_orders": 5,
        }
        score = predict(features)
        assert score == pytest.approx(0.08)
