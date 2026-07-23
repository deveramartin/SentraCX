"""Tests for conversation API routes."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


async def test_analyze_message() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/conversations/conv-123/analyze-message",
            json={"text": "Hello, my order has not arrived yet.", "sender_role": "customer"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] in ["positive", "neutral", "negative"]
    assert "sentiment_score" in data
    assert "escalation_flag" in data


async def test_get_conversation_summary() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/conversations/conv-123/summary")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert isinstance(data["key_points"], list)
    assert "resolved" in data
    assert "computed_at" in data


async def test_suggest_replies() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/conversations/conv-123/suggest-replies")
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)


async def test_detect_intent() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/conversations/conv-123/detect-intent",
            json={"text": "I need help with my tracking number"}
        )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "confidence" in data


async def test_get_conversation_entities() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/conversations/conv-123/entities")
    assert response.status_code == 200
    data = response.json()
    assert "entities" in data
    assert isinstance(data["entities"], list)
