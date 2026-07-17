"""Tests for ConversationTranscriptRepository."""

import pytest
from unittest.mock import AsyncMock, MagicMock

from app.repositories.mongo.conversation_transcript_repository import ConversationTranscriptRepository

@pytest.fixture
def mock_collection() -> AsyncMock:
    return AsyncMock()

@pytest.fixture
def mock_db(mock_collection: AsyncMock) -> MagicMock:
    db = MagicMock()
    db.__getitem__.return_value = mock_collection
    return db

@pytest.fixture
def repo(mock_db: MagicMock) -> ConversationTranscriptRepository:
    return ConversationTranscriptRepository(database=mock_db)

async def test_save_analysis(repo: ConversationTranscriptRepository, mock_collection: AsyncMock) -> None:
    data = {
        "full_transcript_text": "text",
        "sentiment": "negative",
        "sentiment_score": -0.8,
        "predicted_category": "billing",
        "urgency_score": 0.5,
        "reasoning": "Test"
    }
    
    await repo.save_analysis("tick-1", data)
    
    mock_collection.insert_one.assert_called_once()
    args = mock_collection.insert_one.call_args[0][0]
    assert args["crms_ticket_id"] == "tick-1"
    assert args["sentiment"] == "negative"
    assert "analyzed_at" in args

async def test_get_latest_analysis(repo: ConversationTranscriptRepository, mock_collection: AsyncMock) -> None:
    mock_collection.find_one.return_value = {"_id": "obj1", "crms_ticket_id": "tick-1"}
    
    result = await repo.get_latest_analysis("tick-1")
    
    assert result == {"_id": "obj1", "crms_ticket_id": "tick-1"}
    mock_collection.find_one.assert_called_once_with({"crms_ticket_id": "tick-1"}, sort=[("analyzed_at", -1)])

async def test_get_analysis_history(repo: ConversationTranscriptRepository, mock_collection: AsyncMock) -> None:
    class MockCursor:
        def __init__(self, data):
            self.data = data
            self.index = 0
            
        def __aiter__(self):
            return self
            
        async def __anext__(self):
            if self.index < len(self.data):
                val = self.data[self.index]
                self.index += 1
                return val
            raise StopAsyncIteration

    mock_collection.find = MagicMock(return_value=MockCursor([
        {"_id": "obj1", "crms_ticket_id": "tick-1"},
        {"_id": "obj2", "crms_ticket_id": "tick-1"}
    ]))
    
    result = await repo.get_analysis_history("tick-1")
    
    assert len(result) == 2
    mock_collection.find.assert_called_once_with({"crms_ticket_id": "tick-1"}, sort=[("analyzed_at", -1)])
