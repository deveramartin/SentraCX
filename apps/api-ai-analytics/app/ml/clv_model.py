"""Heuristic Customer Lifetime Value prediction model."""


def predict(features: dict) -> float:
    """Predict customer lifetime value in currency units.

    Features used:
    - total_order_value: float
    - total_orders: int
    - account_age_days: int
    - average_order_value: float
    - order_frequency_per_month: float
    """
    total_order_value = features.get("total_order_value", 0.0)
    total_orders = features.get("total_orders", 0)
    account_age_days = features.get("account_age_days", 0)
    average_order_value = features.get("average_order_value", 0.0)
    order_frequency_per_month = features.get("order_frequency_per_month", 0.0)

    if total_orders == 0 or account_age_days == 0:
        return 0.0

    # Project 12 months forward based on current behavior
    monthly_value = average_order_value * order_frequency_per_month
    projected_annual = monthly_value * 12

    # Apply retention multiplier based on tenure
    if account_age_days > 365:
        retention_multiplier = 0.85
    elif account_age_days > 180:
        retention_multiplier = 0.70
    elif account_age_days > 90:
        retention_multiplier = 0.55
    else:
        retention_multiplier = 0.40

    # Growth factor based on trend
    if total_orders >= 5:
        growth_factor = 1.1
    elif total_orders >= 3:
        growth_factor = 1.0
    else:
        growth_factor = 0.9

    clv = projected_annual * retention_multiplier * growth_factor

    # Floor at historical value, cap at 5x historical
    clv = max(clv, total_order_value * 0.5)
    clv = min(clv, total_order_value * 5.0)

    return round(clv, 2)
