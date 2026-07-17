"""Pydantic schemas for ticket analysis."""

from datetime import datetime
from pydantic import BaseModel, Field


class TicketAnalysisRequest(BaseModel):
    """Request schema for ticket analysis."""
    ticket_id: str | None = None
    text: str | None = None
    include_messages: bool = True


class TicketAnalysisResponse(BaseModel):
    """Response schema for ticket analysis."""
    ticket_id: str
    sentiment: str = Field(pattern="^(positive|neutral|negative)$")
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    predicted_category: str
    urgency_score: float = Field(ge=0.0, le=1.0)
    reasoning: str
    computed_at: datetime
    cached: bool
