"""Pydantic schemas for AI configurations."""

from datetime import datetime
from pydantic import BaseModel, Field


class ChurnThresholdConfig(BaseModel):
    """Configuration for churn risk threshold."""
    churn_threshold: float = Field(
        ..., ge=0.0, le=1.0, description="Churn risk threshold value (probability)"
    )


class PriorityWeightsConfig(BaseModel):
    """Configuration for ticket priority weighting."""
    sentiment_weight: float = Field(
        ..., ge=0.0, le=1.0, description="Weight for sentiment analysis score"
    )
    urgency_weight: float = Field(
        ..., ge=0.0, le=1.0, description="Weight for urgency score"
    )
    history_weight: float = Field(
        ..., ge=0.0, le=1.0, description="Weight for customer historical risk profile"
    )


class AnomalySensitivityConfig(BaseModel):
    """Configuration for anomaly detection sensitivity."""
    sensitivity: float = Field(
        ..., ge=0.0, le=1.0, description="Sensitivity threshold for anomaly alerts"
    )


class ConfidenceThresholdsConfig(BaseModel):
    """Configuration for various model confidence thresholds."""
    sentiment_threshold: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence threshold for sentiment analysis"
    )
    category_threshold: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence threshold for category classification"
    )
    nba_threshold: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence threshold for Next-Best-Action"
    )
    resolution_estimate_threshold: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence threshold for resolution estimate"
    )


class ConfigAuditResponse(BaseModel):
    """Schema for config changes audit log entries."""
    key: str
    changed_by: str
    old_value: dict | None = None
    new_value: dict
    changed_at: datetime
