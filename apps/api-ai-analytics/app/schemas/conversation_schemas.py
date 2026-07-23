"""Pydantic schemas for Conversation analysis API."""

from datetime import datetime
from pydantic import BaseModel, Field


class MessageAnalysisRequest(BaseModel):
    """Request schema for message analysis."""

    text: str = Field(description="The text content of the message")
    sender_role: str = Field(default="customer", description="The role of the message sender (customer/agent)")


class MessageAnalysisResponse(BaseModel):
    """Response schema for message analysis."""

    sentiment: str = Field(pattern="^(positive|neutral|negative)$", description="Sentiment classification")
    sentiment_score: float = Field(ge=-1.0, le=1.0, description="Sentiment score")
    escalation_flag: bool = Field(description="True if escalation to a human agent is recommended")
    reason: str | None = Field(default=None, description="Reason for escalation or sentiment classification")


class ConversationSummaryResponse(BaseModel):
    """Response schema for conversation summary."""

    summary: str = Field(description="Executive summary of the conversation")
    key_points: list[str] = Field(default_factory=list, description="Key discussion points")
    resolved: bool = Field(default=False, description="Whether the issue discussed was resolved")
    computed_at: datetime


class SuggestedReply(BaseModel):
    """Single suggested reply option."""

    text: str = Field(description="Suggested response text")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence score")


class SuggestedRepliesResponse(BaseModel):
    """Response schema for suggested replies."""

    suggestions: list[SuggestedReply] = Field(default_factory=list, description="List of reply suggestions")


class IntentDetectionRequest(BaseModel):
    """Request schema for intent detection."""

    text: str = Field(description="The text to analyze")


class IntentDetectionResponse(BaseModel):
    """Response schema for intent detection."""

    intent: str = Field(description="Detected customer intent")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence score")


class EntityReference(BaseModel):
    """Extracted entity reference."""

    entity_type: str = Field(description="Type of entity (e.g. order_number, product_name, email)")
    value: str = Field(description="The extracted entity value")
    meta: dict = Field(default_factory=dict, description="Metadata associated with the entity, such as OOS cross-references")


class ConversationEntitiesResponse(BaseModel):
    """Response schema for conversation entities."""

    entities: list[EntityReference] = Field(default_factory=list, description="List of extracted entities")
