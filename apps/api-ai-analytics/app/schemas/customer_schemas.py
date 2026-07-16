"""Pydantic schemas for Customer Insights API."""

from datetime import datetime

from pydantic import BaseModel, Field


class CustomerFeatures(BaseModel):
    """Internal feature vector for ML model input."""

    customer_id: str
    days_since_last_order: int = 0
    order_frequency_trend: float = 0.0
    ticket_count_last_90d: int = 0
    account_age_days: int = 0
    total_orders: int = 0
    total_order_value: float = 0.0
    average_order_value: float = 0.0
    order_frequency_per_month: float = 0.0


class NextBestAction(BaseModel):
    """Next-Best-Action recommendation."""

    action: str = Field(description="Recommended action identifier")
    reason: str = Field(description="Human-readable explanation")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score")


class CustomerInsightsResponse(BaseModel):
    """Response schema for customer insights endpoint."""

    customer_id: str
    churn_score: float = Field(ge=0.0, le=1.0, description="Churn risk score")
    clv_prediction: float = Field(ge=0.0, description="Predicted lifetime value")
    next_best_action: NextBestAction
    computed_at: datetime
    cached: bool = Field(
        default=False, description="Whether result was served from cache"
    )
