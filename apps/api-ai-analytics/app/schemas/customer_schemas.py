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


class CustomerSegmentResponse(BaseModel):
    """Response schema for customer segment endpoint."""

    segment: str = Field(description="Customer segment category")
    computed_at: datetime
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence score")


class ChurnScoreResponse(BaseModel):
    """Response schema for customer churn score endpoint."""

    score: float = Field(ge=0.0, le=1.0, description="Churn risk score")
    risk_level: str = Field(description="Risk level classification (high, medium, low)")
    contributing_factors: list[str] = Field(default_factory=list, description="Top factors contributing to churn risk")
    computed_at: datetime


class ClvResponse(BaseModel):
    """Response schema for customer CLV endpoint."""

    predicted_clv: float = Field(ge=0.0, description="Predicted customer lifetime value")
    currency: str = Field(default="USD", description="Currency of CLV prediction")
    computed_at: datetime


class NextActionResponse(BaseModel):
    """Response schema for customer next action endpoint."""

    action: str = Field(description="Recommended action identifier")
    reason: str = Field(description="Human-readable explanation of why this action was chosen")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score")
    computed_at: datetime


class NextActionFeedbackRequest(BaseModel):
    """Request schema for customer next action feedback endpoint."""

    feedback: str = Field(pattern="^(accept|dismiss|complete)$", description="User feedback action")

