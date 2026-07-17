"""Unit tests for Groq client."""

import pytest
import json
import httpx
from unittest.mock import AsyncMock, patch

from app.lib.groq_client import GroqClient, GroqClientError
from groq import APIStatusError, APITimeoutError


@pytest.fixture
def groq_client() -> GroqClient:
    return GroqClient(api_key="test-key", model_id="llama-3.1-8b-instant")


async def test_analyze_success(groq_client: GroqClient) -> None:
    expected_response = {"sentiment": "positive", "category": "general_inquiry"}
    
    class MockMessage:
        content = json.dumps(expected_response)
        
    class MockChoice:
        message = MockMessage()
        
    class MockResponse:
        choices = [MockChoice()]

    with patch("groq.resources.chat.completions.AsyncCompletions.create", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = MockResponse()
        result = await groq_client.analyze("system", "user")
        assert result == expected_response


async def test_analyze_rate_limit_retry(groq_client: GroqClient) -> None:
    expected_response = {"sentiment": "positive"}
    
    class MockMessage:
        content = json.dumps(expected_response)
        
    class MockChoice:
        message = MockMessage()
        
    class MockResponse:
        choices = [MockChoice()]

    mock_httpx_response = httpx.Response(429, request=httpx.Request("POST", "url"))
    mock_429 = APIStatusError(message="Rate limit", response=mock_httpx_response, body=None)
    
    with patch("groq.resources.chat.completions.AsyncCompletions.create", new_callable=AsyncMock) as mock_create:
        mock_create.side_effect = [mock_429, MockResponse()]
        
        with patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
            result = await groq_client.analyze("system", "user")
            
            assert mock_sleep.call_count == 1
            assert mock_sleep.call_args[0][0] == 1 # 2**0
            assert result == expected_response


async def test_analyze_timeout_retry(groq_client: GroqClient) -> None:
    expected_response = {"sentiment": "positive"}
    
    class MockMessage:
        content = json.dumps(expected_response)
        
    class MockChoice:
        message = MockMessage()
        
    class MockResponse:
        choices = [MockChoice()]

    mock_timeout = APITimeoutError(request=httpx.Request("POST", "url"))
    
    with patch("groq.resources.chat.completions.AsyncCompletions.create", new_callable=AsyncMock) as mock_create:
        mock_create.side_effect = [mock_timeout, MockResponse()]
        
        with patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
            result = await groq_client.analyze("system", "user")
            
            assert mock_sleep.call_count == 1
            assert result == expected_response


async def test_analyze_json_decode_error(groq_client: GroqClient) -> None:
    class MockMessage:
        content = "invalid json"
        
    class MockChoice:
        message = MockMessage()
        
    class MockResponse:
        choices = [MockChoice()]

    with patch("groq.resources.chat.completions.AsyncCompletions.create", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = MockResponse()
        with pytest.raises(GroqClientError, match="Invalid JSON from Groq API"):
            await groq_client.analyze("system", "user")


async def test_analyze_max_retries_exceeded(groq_client: GroqClient) -> None:
    mock_httpx_response = httpx.Response(429, request=httpx.Request("POST", "url"))
    mock_429 = APIStatusError(message="Rate limit", response=mock_httpx_response, body=None)
    
    with patch("groq.resources.chat.completions.AsyncCompletions.create", new_callable=AsyncMock) as mock_create:
        mock_create.side_effect = mock_429
        
        with patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
            with pytest.raises(GroqClientError, match="Groq API failed after all retries"):
                await groq_client.analyze("system", "user")
            
            assert mock_sleep.call_count == 3
