"""Internal data models for ticket and conversation MongoDB collections."""

from datetime import datetime
from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    """Embedded representation of a chat message within a ticket transcript."""

    message_id: str
    sender_id: str
    content: str
    sent_at: datetime


class ConversationTranscriptDocument(BaseModel):
    """MongoDB document schema for ConversationTranscripts collection."""

    ticket_id: str = Field(alias="crms_ticket_id")
    messages: list[ConversationMessage] = Field(default_factory=list)
    full_transcript_text: str = ""
    extracted_entities: list[dict] = Field(default_factory=list)
    auto_summary: str = ""
    sentiment: str = "neutral"
    sentiment_score: float = 0.0
    predicted_category: str = "general_inquiry"
    urgency_score: float = 0.0
    reasoning: str = ""
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class TicketDocument(BaseModel):
    """MongoDB document schema for tickets collection (denormalized)."""

    ticket_id: str = Field(alias="_id")
    customer_id: str
    category: str | None = None
    status: str
    title: str
    description: str
    created_at: datetime
    updated_at: datetime
    synced_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
