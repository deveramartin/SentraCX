"""Heuristic churn risk scoring model."""

from datetime import datetime, timezone


def predict(features: dict) -> float:
    """Predict churn risk score (0.0 = no risk, 1.0 = certain churn).

    Features used:
    - days_since_last_order: int
    - order_frequency_trend: float (-1.0 declining to 1.0 growing)
    - ticket_count_last_90d: int
    - account_age_days: int
    - total_orders: int
    """
    days_since_last_order = features.get("days_since_last_order", 0)
    order_frequency_trend = features.get("order_frequency_trend", 0.0)
    ticket_count_last_90d = features.get("ticket_count_last_90d", 0)
    account_age_days = features.get("account_age_days", 0)
    total_orders = features.get("total_orders", 0)

    score = 0.0

    # Recency factor (0-0.35)
    if days_since_last_order > 180:
        score += 0.35
    elif days_since_last_order > 90:
        score += 0.25
    elif days_since_last_order > 60:
        score += 0.15
    elif days_since_last_order > 30:
        score += 0.08

    # Frequency decline factor (0-0.25)
    if order_frequency_trend < -0.5:
        score += 0.25
    elif order_frequency_trend < -0.2:
        score += 0.15
    elif order_frequency_trend < 0:
        score += 0.08

    # Support ticket factor (0-0.20)
    if ticket_count_last_90d >= 5:
        score += 0.20
    elif ticket_count_last_90d >= 3:
        score += 0.12
    elif ticket_count_last_90d >= 1:
        score += 0.05

    # New account bonus (reduces churn score for new accounts)
    if account_age_days < 30 and total_orders <= 1:
        score *= 0.5

    # Low engagement penalty
    if total_orders == 0 and account_age_days > 60:
        score += 0.20

    return min(max(score, 0.0), 1.0)
