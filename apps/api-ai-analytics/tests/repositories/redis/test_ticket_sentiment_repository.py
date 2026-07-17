"""Tests for TicketSentimentRepository."""

import pytest
import json
from unittest.mock import AsyncMock

from app.repositories.redis.ticket_sentiment_repository import TicketSentimentRepository

@pytest.fixture
def mock_redis() -> AsyncMock:
    return AsyncMock()

@pytest.fixture
def repo(mock_redis: AsyncMock) -> TicketSentimentRepository:
    return TicketSentimentRepository(redis_client=mock_redis)

async def test_add_sentiment_score(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    await repo.add_sentiment_score("tick-1", -0.5, 123456.0)
    mock_redis.zadd.assert_called_once_with("ticket:tick-1:sentiment_stream", {"123456.0:-0.5": 123456.0})

async def test_get_sentiment_history(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    mock_redis.zrange.return_value = [("123456.0:-0.5", 123456.0), ("123457.0:0.8", 123457.0)]
    
    history = await repo.get_sentiment_history("tick-1")
    
    assert history == [(123456.0, -0.5), (123457.0, 0.8)]
    mock_redis.zrange.assert_called_once_with("ticket:tick-1:sentiment_stream", 0, -1, withscores=True)

async def test_get_cached_analysis(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    mock_redis.get.return_value = json.dumps({"category": "test"})
    
    result = await repo.get_cached_analysis("tick-1")
    
    assert result == {"category": "test"}
    mock_redis.get.assert_called_once_with("ticket:tick-1:analysis")

async def test_get_cached_analysis_miss(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    mock_redis.get.return_value = None
    result = await repo.get_cached_analysis("tick-1")
    assert result is None

async def test_set_cached_analysis(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    await repo.set_cached_analysis("tick-1", {"category": "test"}, 3600)
    mock_redis.setex.assert_called_once_with("ticket:tick-1:analysis", 3600, json.dumps({"category": "test"}))

async def test_invalidate_analysis(repo: TicketSentimentRepository, mock_redis: AsyncMock) -> None:
    await repo.invalidate_analysis("tick-1")
    mock_redis.delete.assert_called_once_with("ticket:tick-1:analysis")
