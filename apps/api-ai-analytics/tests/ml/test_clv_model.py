"""Unit tests for Customer Lifetime Value prediction model."""

import pytest

from app.ml.clv_model import predict


class TestClvModelPredict:
    """Tests for clv_model.predict()."""

    def test_zero_orders_returns_zero(self):
        """Customer with zero orders returns 0.0 CLV."""
        features = {
            "total_order_value": 0.0,
            "total_orders": 0,
            "account_age_days": 180,
            "average_order_value": 0.0,
            "order_frequency_per_month": 0.0,
        }
        assert predict(features) == 0.0

    def test_zero_account_age_returns_zero(self):
        """Customer with zero account age returns 0.0 CLV."""
        features = {
            "total_order_value": 500.0,
            "total_orders": 5,
            "account_age_days": 0,
            "average_order_value": 100.0,
            "order_frequency_per_month": 2.0,
        }
        assert predict(features) == 0.0

    def test_loyal_long_term_customer(self):
        """Loyal customer (400 days, 10 orders) gets high retention and growth."""
        features = {
            "total_order_value": 2000.0,
            "total_orders": 10,
            "account_age_days": 400,
            "average_order_value": 200.0,
            "order_frequency_per_month": 2.5,
        }
        result = predict(features)
        # monthly_value = 200 * 2.5 = 500
        # projected_annual = 500 * 12 = 6000
        # retention = 0.85 (>365 days)
        # growth = 1.1 (>=5 orders)
        # clv = 6000 * 0.85 * 1.1 = 5610
        # floor = 2000 * 0.5 = 1000, cap = 2000 * 5 = 10000
        # result = 5610 (within bounds)
        assert result == pytest.approx(5610.0)

    def test_new_customer(self):
        """New customer (60 days, 2 orders) gets lower retention and growth."""
        features = {
            "total_order_value": 150.0,
            "total_orders": 2,
            "account_age_days": 60,
            "average_order_value": 75.0,
            "order_frequency_per_month": 1.0,
        }
        result = predict(features)
        # monthly_value = 75 * 1 = 75
        # projected_annual = 75 * 12 = 900
        # retention = 0.40 (<=90 days)
        # growth = 0.9 (<3 orders)
        # clv = 900 * 0.40 * 0.9 = 324.0
        # floor = 150 * 0.5 = 75, cap = 150 * 5 = 750
        # result = 324 (within bounds)
        assert result == pytest.approx(324.0)

    def test_result_always_non_negative(self):
        """CLV result is always >= 0."""
        features = {
            "total_order_value": 10.0,
            "total_orders": 1,
            "account_age_days": 1,
            "average_order_value": 10.0,
            "order_frequency_per_month": 0.1,
        }
        result = predict(features)
        assert result >= 0.0

    def test_floor_enforcement(self):
        """CLV is floored at total_order_value * 0.5."""
        features = {
            "total_order_value": 5000.0,
            "total_orders": 1,
            "account_age_days": 30,
            "average_order_value": 10.0,
            "order_frequency_per_month": 0.1,
        }
        result = predict(features)
        # monthly_value = 10 * 0.1 = 1
        # projected_annual = 1 * 12 = 12
        # retention = 0.40
        # growth = 0.9
        # clv = 12 * 0.40 * 0.9 = 4.32
        # floor = 5000 * 0.5 = 2500 → clv should be bumped to 2500
        assert result == pytest.approx(2500.0)

    def test_cap_enforcement(self):
        """CLV is capped at total_order_value * 5.0."""
        features = {
            "total_order_value": 100.0,
            "total_orders": 10,
            "account_age_days": 400,
            "average_order_value": 500.0,
            "order_frequency_per_month": 5.0,
        }
        result = predict(features)
        # monthly_value = 500 * 5 = 2500
        # projected_annual = 2500 * 12 = 30000
        # retention = 0.85
        # growth = 1.1
        # clv = 30000 * 0.85 * 1.1 = 28050
        # cap = 100 * 5 = 500 → clv capped at 500
        assert result == pytest.approx(500.0)

    def test_retention_multiplier_over_180_days(self):
        """Account age 181-365 days gets 0.70 retention multiplier."""
        features = {
            "total_order_value": 800.0,
            "total_orders": 4,
            "account_age_days": 200,
            "average_order_value": 200.0,
            "order_frequency_per_month": 2.0,
        }
        result = predict(features)
        # monthly_value = 200 * 2 = 400
        # projected_annual = 400 * 12 = 4800
        # retention = 0.70 (>180, <=365)
        # growth = 1.0 (>=3, <5)
        # clv = 4800 * 0.70 * 1.0 = 3360
        # floor = 800 * 0.5 = 400, cap = 800 * 5 = 4000
        # result = 3360 (within bounds)
        assert result == pytest.approx(3360.0)

    def test_retention_multiplier_over_90_days(self):
        """Account age 91-180 days gets 0.55 retention multiplier."""
        features = {
            "total_order_value": 600.0,
            "total_orders": 3,
            "account_age_days": 120,
            "average_order_value": 200.0,
            "order_frequency_per_month": 1.5,
        }
        result = predict(features)
        # monthly_value = 200 * 1.5 = 300
        # projected_annual = 300 * 12 = 3600
        # retention = 0.55 (>90, <=180)
        # growth = 1.0 (>=3, <5)
        # clv = 3600 * 0.55 * 1.0 = 1980
        # floor = 600 * 0.5 = 300, cap = 600 * 5 = 3000
        # result = 1980 (within bounds)
        assert result == pytest.approx(1980.0)
