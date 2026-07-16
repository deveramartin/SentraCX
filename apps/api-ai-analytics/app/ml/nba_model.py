"""Heuristic Next-Best-Action recommendation model."""


def predict(features: dict) -> dict:
    """Recommend next-best-action based on customer features.

    Returns dict with:
    - action: str (the recommended action identifier)
    - reason: str (human-readable explanation)
    - confidence: float (0.0-1.0)

    Features used:
    - churn_score: float (0.0-1.0)
    - clv_prediction: float
    - days_since_last_order: int
    - total_orders: int
    - ticket_count_last_90d: int
    - account_age_days: int
    """
    churn_score = features.get("churn_score", 0.0)
    clv = features.get("clv_prediction", 0.0)
    days_since_last_order = features.get("days_since_last_order", 0)
    total_orders = features.get("total_orders", 0)
    ticket_count_last_90d = features.get("ticket_count_last_90d", 0)
    account_age_days = features.get("account_age_days", 0)

    # High churn + high value → retention offer
    if churn_score >= 0.7 and clv >= 500:
        return {
            "action": "offer_discount",
            "reason": "High-value customer at risk of churning",
            "confidence": 0.85,
        }

    # High churn + lower value → reactivation campaign
    if churn_score >= 0.7:
        return {
            "action": "send_reactivation_campaign",
            "reason": "Customer showing strong churn signals",
            "confidence": 0.80,
        }

    # Many support tickets → proactive outreach
    if ticket_count_last_90d >= 3:
        return {
            "action": "proactive_support_outreach",
            "reason": "Frequent support interactions indicate friction",
            "confidence": 0.75,
        }

    # Dormant but not churning → re-engagement
    if days_since_last_order > 60 and churn_score < 0.5:
        return {
            "action": "send_product_recommendations",
            "reason": "Customer inactive but not yet at high churn risk",
            "confidence": 0.65,
        }

    # New customer → onboarding
    if account_age_days < 30 and total_orders <= 1:
        return {
            "action": "send_onboarding_series",
            "reason": "New customer needs engagement to build loyalty",
            "confidence": 0.70,
        }

    # High value, active → upsell
    if clv >= 1000 and churn_score < 0.3:
        return {
            "action": "offer_premium_upgrade",
            "reason": "Loyal high-value customer likely to respond to upsell",
            "confidence": 0.60,
        }

    # Default: nurture
    return {
        "action": "continue_nurture_sequence",
        "reason": "Customer is stable, continue regular engagement",
        "confidence": 0.50,
    }
