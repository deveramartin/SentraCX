"""Unit tests for ticket analyzer."""

import pytest
from unittest.mock import AsyncMock

from app.ml.ticket_analyzer import TicketAnalyzer
from app.lib.groq_client import GroqClient, GroqClientError


@pytest.fixture
def mock_groq_client() -> AsyncMock:
    return AsyncMock(spec=GroqClient)


@pytest.fixture
def analyzer(mock_groq_client: AsyncMock) -> TicketAnalyzer:
    return TicketAnalyzer(groq_client=mock_groq_client)


async def test_analyze_uses_groq(analyzer: TicketAnalyzer, mock_groq_client: AsyncMock) -> None:
    expected_result = {
        "sentiment": "negative",
        "sentiment_score": -0.8,
        "category": "technical_issue",
        "urgency_score": 0.9,
        "reasoning": "User is unable to login"
    }
    mock_groq_client.analyze.return_value = expected_result
    
    result = await analyzer.analyze("Login issue", "I cannot login to my account.", ["Please help ASAP!"])
    
    assert result == expected_result
    mock_groq_client.analyze.assert_called_once()
    call_args = mock_groq_client.analyze.call_args[0]
    assert "Title: Login issue" in call_args[1]
    assert "Messages:" in call_args[1]


async def test_analyze_fallback_on_groq_error(analyzer: TicketAnalyzer, mock_groq_client: AsyncMock) -> None:
    mock_groq_client.analyze.side_effect = GroqClientError("API down")
    
    result = await analyzer.analyze("Broken product", "The item is broken and terrible.", ["I want a refund"])
    
    assert result["category"] == "refund_request"
    assert result["sentiment"] == "negative"
    assert result["sentiment_score"] < 0
    assert result["reasoning"] == "Fallback heuristic analysis."


async def test_heuristic_analyze_urgency() -> None:
    analyzer = TicketAnalyzer(AsyncMock())
    result = analyzer._heuristic_analyze("URGENT: Server down", "Emergency, please help ASAP", [])
    
    assert result["urgency_score"] == 0.9
