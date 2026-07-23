"""Tests for the Ticket Ingestion Service."""

import json
from unittest.mock import AsyncMock
import pytest
from redis.asyncio import Redis

from app.repositories.mongo.ticket_repository import TicketRepository
from app.repositories.mongo.conversation_transcript_repository import (
    ConversationTranscriptRepository,
)
from app.services.ticket_ingestion_service import TicketIngestionService


@pytest.fixture
def redis_client() -> AsyncMock:
    return AsyncMock(spec=Redis)


@pytest.fixture
def ticket_repo() -> AsyncMock:
    return AsyncMock(spec=TicketRepository)


@pytest.fixture
def transcript_repo() -> AsyncMock:
    return AsyncMock(spec=ConversationTranscriptRepository)


@pytest.fixture
def service(
    redis_client: AsyncMock,
    ticket_repo: AsyncMock,
    transcript_repo: AsyncMock,
) -> TicketIngestionService:
    return TicketIngestionService(redis_client, ticket_repo, transcript_repo)


async def test_handle_ticket_event_success(
    service: TicketIngestionService, ticket_repo: AsyncMock
) -> None:
    payload = {
        "ticket_id": "tick-123",
        "customer_id": "cust-456",
        "category": "billing",
        "status": "Open",
        "title": "Double charge",
        "description": "Charged twice for subscription",
        "created_at": "2026-07-23T10:00:00Z",
        "updated_at": "2026-07-23T10:05:00Z",
    }

    await service._handle_ticket_event(payload)

    ticket_repo.upsert_ticket.assert_called_once()
    args = ticket_repo.upsert_ticket.call_args[0][0]
    assert args.ticket_id == "tick-123"
    assert args.category == "billing"
    assert args.status == "Open"


async def test_handle_message_event_success(
    service: TicketIngestionService, transcript_repo: AsyncMock
) -> None:
    payload = {
        "message_id": "msg-789",
        "ticket_id": "tick-123",
        "sender_id": "cust-456",
        "content": "Where is my refund?",
        "sent_at": "2026-07-23T10:10:00Z",
    }

    await service._handle_message_event(payload)

    transcript_repo.append_message.assert_called_once()
    args = transcript_repo.append_message.call_args[0]
    assert args[0] == "tick-123"
    assert args[1].message_id == "msg-789"
    assert args[1].content == "Where is my refund?"
