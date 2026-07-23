"""Tests for ticket schemas."""

import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from app.schemas.ticket_schemas import TicketAnalysisRequest, TicketAnalysisResponse


def test_ticket_analysis_request_valid() -> None:
    req = TicketAnalysisRequest(ticket_id="tick-1", include_messages=False)
    assert req.ticket_id == "tick-1"
    assert req.include_messages is False
    assert req.text is None


def test_ticket_analysis_response_valid() -> None:
    resp = TicketAnalysisResponse(
        ticket_id="tick-1",
        sentiment="positive",
        sentiment_score=0.8,
        predicted_category="general_inquiry",
        urgency_score=0.2,
        confidence=0.9,
        reasoning="Good feedback",
        computed_at=datetime.now(timezone.utc),
        cached=False
    )
    assert resp.sentiment == "positive"


def test_ticket_analysis_response_invalid_sentiment() -> None:
    with pytest.raises(ValidationError):
        TicketAnalysisResponse(
            ticket_id="tick-1",
            sentiment="happy",  # invalid
            sentiment_score=0.8,
            predicted_category="general_inquiry",
            urgency_score=0.2,
            confidence=0.9,
            reasoning="Good feedback",
            computed_at=datetime.now(timezone.utc),
            cached=False
        )


def test_ticket_analysis_response_invalid_score() -> None:
    with pytest.raises(ValidationError):
        TicketAnalysisResponse(
            ticket_id="tick-1",
            sentiment="positive",
            sentiment_score=1.5,  # invalid
            predicted_category="general_inquiry",
            urgency_score=0.2,
            confidence=0.9,
            reasoning="Good feedback",
            computed_at=datetime.now(timezone.utc),
            cached=False
        )
