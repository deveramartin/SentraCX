"""Tests for health check API routes."""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from app.main import app
from app.db.redis import get_redis_client


@pytest.fixture
def mock_redis():
    redis_mock = AsyncMock()
    return redis_mock


async def test_health_status_healthy(mock_redis) -> None:
    # Set degraded flag to None (not degraded)
    mock_redis.get.return_value = None
    mock_redis.ping.return_value = True

    app.dependency_overrides[get_redis_client] = lambda: mock_redis

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health/status")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

    app.dependency_overrides.clear()


async def test_health_status_degraded(mock_redis) -> None:
    # Set degraded flag to "true"
    mock_redis.get.return_value = "true"

    app.dependency_overrides[get_redis_client] = lambda: mock_redis

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health/status")

    assert response.status_code == 503
    assert response.json()["detail"] == "Service is degraded"

    app.dependency_overrides.clear()


async def test_health_status_redis_error(mock_redis) -> None:
    # Redis ping raises an error
    mock_redis.get.return_value = None
    mock_redis.ping.side_effect = Exception("Redis connection refused")

    app.dependency_overrides[get_redis_client] = lambda: mock_redis

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health/status")

    assert response.status_code == 503
    assert "Health check failed" in response.json()["detail"]

    app.dependency_overrides.clear()
