"""Conversation analysis API endpoints."""

from datetime import datetime, timezone
from fastapi import APIRouter, status

from app.schemas.conversation_schemas import (
    MessageAnalysisRequest,
    MessageAnalysisResponse,
    ConversationSummaryResponse,
    SuggestedRepliesResponse,
    SuggestedReply,
    IntentDetectionRequest,
    IntentDetectionResponse,
    ConversationEntitiesResponse,
    EntityReference,
)

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post(
    "/{id}/analyze-message",
    response_model=MessageAnalysisResponse,
    summary="Analyze real-time message",
    description="Analyze a single conversation message for sentiment and escalation flag.",
)
async def analyze_message(id: str, request: MessageAnalysisRequest) -> MessageAnalysisResponse:
    """Analyze real-time conversation message sentiment and escalation risk."""
    # Mock response
    return MessageAnalysisResponse(
        sentiment="neutral",
        sentiment_score=0.0,
        escalation_flag=False,
        reason=None,
    )


@router.get(
    "/{id}/summary",
    response_model=ConversationSummaryResponse,
    summary="Get conversation summary",
    description="Retrieve an on-demand, potentially cached summary of the conversation.",
)
async def get_conversation_summary(id: str) -> ConversationSummaryResponse:
    """Generate or retrieve a summary of a conversation."""
    # Mock response
    return ConversationSummaryResponse(
        summary="Customer inquired about order status and delivery timeline.",
        key_points=["Inquired about order delivery", "Provided order number OOS-998877"],
        resolved=True,
        computed_at=datetime.now(timezone.utc),
    )


@router.post(
    "/{id}/suggest-replies",
    response_model=SuggestedRepliesResponse,
    summary="Suggest agent replies",
    description="Generate smart replies for the agent based on conversation context.",
)
async def suggest_replies(id: str) -> SuggestedRepliesResponse:
    """Get AI suggestions for conversation replies."""
    # Mock response
    return SuggestedRepliesResponse(
        suggestions=[
            SuggestedReply(text="Sure, I can help you look up that order status.", confidence=0.91),
            SuggestedReply(text="Could you please confirm your shipping address?", confidence=0.74),
        ]
    )


@router.post(
    "/{id}/detect-intent",
    response_model=IntentDetectionResponse,
    summary="Detect conversation intent",
    description="Detect customer intent from conversation history.",
)
async def detect_intent(id: str, request: IntentDetectionRequest) -> IntentDetectionResponse:
    """Detect intent from text or conversation segment."""
    # Mock response
    return IntentDetectionResponse(
        intent="track_order",
        confidence=0.88,
    )


@router.get(
    "/{id}/entities",
    response_model=ConversationEntitiesResponse,
    summary="Extract conversation entities",
    description="Extract key entities like order numbers, cross-referencing OOS details.",
)
async def get_conversation_entities(id: str) -> ConversationEntitiesResponse:
    """Get entities extracted from the conversation history."""
    # Mock response
    return ConversationEntitiesResponse(
        entities=[
            EntityReference(
                entity_type="order_number",
                value="OOS-998877",
                meta={"exists_in_oos": True, "status": "shipped"},
            )
        ]
    )
