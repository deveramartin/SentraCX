"""Pydantic schemas for Dashboard and aggregate analysis API."""

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class DashboardSummaryResponse(BaseModel):
    """Response schema for dashboard summary metrics."""

    churn_rate: float = Field(ge=0.0, le=1.0, description="Average churn risk across customers")
    average_sentiment: float = Field(ge=-1.0, le=1.0, description="Average sentiment score across tickets/conversations")
    total_tickets: int = Field(ge=0, description="Total tickets received in timeframe")
    resolved_tickets: int = Field(ge=0, description="Number of resolved tickets in timeframe")
    active_campaigns: int = Field(ge=0, description="Number of active marketing campaigns")
    computed_at: datetime


class AnomalyItem(BaseModel):
    """Details of a single detected anomaly."""

    anomaly_id: str
    anomaly_type: str = Field(description="Type of anomaly (e.g. ticket_volume_spike, high_churn_cluster)")
    description: str
    severity: str = Field(pattern="^(high|medium|low)$")
    status: str = Field(pattern="^(open|investigating|resolved)$")
    detected_at: datetime


class AnomalyListResponse(BaseModel):
    """Response schema for anomalies listing."""

    anomalies: list[AnomalyItem] = Field(default_factory=list, description="List of detected anomalies")


class NaturalLanguageQueryRequest(BaseModel):
    """Request schema for natural-language query."""

    query: str = Field(description="Natural language question to execute against analytics data")


class NaturalLanguageQueryResponse(BaseModel):
    """Response schema for natural-language query."""

    query: str
    interpreted_query: str = Field(description="Structured translation or interpretation of the query")
    result: dict[str, Any] = Field(description="Structured data results mapping to the query findings")
    computed_at: datetime
