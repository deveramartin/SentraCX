"""Tests for dashboard API routes."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


async def test_get_dashboard_summary() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/dashboard/summary?from=2026-07-01T00:00:00Z&to=2026-07-23T00:00:00Z")
    assert response.status_code == 200
    data = response.json()
    assert "churn_rate" in data
    assert "average_sentiment" in data
    assert "total_tickets" in data
    assert "resolved_tickets" in data
    assert "active_campaigns" in data
    assert "computed_at" in data


async def test_get_anomalies() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/anomalies?from=2026-07-01T00:00:00Z&to=2026-07-23T00:00:00Z&status=open")
    assert response.status_code == 200
    data = response.json()
    assert "anomalies" in data
    assert isinstance(data["anomalies"], list)
    if len(data["anomalies"]) > 0:
        anomaly = data["anomalies"][0]
        assert "anomaly_id" in anomaly
        assert "anomaly_type" in anomaly
        assert "severity" in anomaly
        assert "status" in anomaly


async def test_execute_natural_language_query() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/query",
            json={"query": "how many billing tickets were resolved last month?"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "how many billing tickets were resolved last month?"
    assert "interpreted_query" in data
    assert "result" in data
    assert "computed_at" in data
