"""Unit tests for config API routes."""

from unittest.mock import AsyncMock
from httpx import AsyncClient, ASGITransport
import pytest

from app.main import app
from app.api.v1.deps import get_config_service


@pytest.fixture
def mock_config_service():
    service = AsyncMock()
    service.get_config = AsyncMock()
    service.update_config = AsyncMock()
    return service


async def test_get_churn_threshold(mock_config_service) -> None:
    """GET /api/v1/config/churn-threshold should call config service and return correct data."""
    mock_config_service.get_config.return_value = {"churn_threshold": 0.65}
    app.dependency_overrides[get_config_service] = lambda: mock_config_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/config/churn-threshold")

    assert response.status_code == 200
    assert response.json() == {"churn_threshold": 0.65}
    mock_config_service.get_config.assert_called_once_with("churn-threshold")
    app.dependency_overrides.clear()


async def test_put_churn_threshold(mock_config_service) -> None:
    """PUT /api/v1/config/churn-threshold should call update_config with X-User-Email header."""
    mock_config_service.update_config.return_value = {"churn_threshold": 0.75}
    app.dependency_overrides[get_config_service] = lambda: mock_config_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/config/churn-threshold",
            json={"churn_threshold": 0.75},
            headers={"X-User-Email": "manager@sentracx.com"},
        )

    assert response.status_code == 200
    assert response.json() == {"churn_threshold": 0.75}
    mock_config_service.update_config.assert_called_once_with(
        key="churn-threshold",
        value={"churn_threshold": 0.75},
        changed_by="manager@sentracx.com",
    )
    app.dependency_overrides.clear()


async def test_get_priority_weights(mock_config_service) -> None:
    """GET /api/v1/config/priority-weights should call config service."""
    mock_config_service.get_config.return_value = {
        "sentiment_weight": 0.4,
        "urgency_weight": 0.3,
        "history_weight": 0.3,
    }
    app.dependency_overrides[get_config_service] = lambda: mock_config_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/config/priority-weights")

    assert response.status_code == 200
    assert response.json() == {
        "sentiment_weight": 0.4,
        "urgency_weight": 0.3,
        "history_weight": 0.3,
    }
    mock_config_service.get_config.assert_called_once_with("priority-weights")
    app.dependency_overrides.clear()


async def test_put_priority_weights(mock_config_service) -> None:
    """PUT /api/v1/config/priority-weights should update config."""
    mock_config_service.update_config.return_value = {
        "sentiment_weight": 0.5,
        "urgency_weight": 0.2,
        "history_weight": 0.3,
    }
    app.dependency_overrides[get_config_service] = lambda: mock_config_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/config/priority-weights",
            json={
                "sentiment_weight": 0.5,
                "urgency_weight": 0.2,
                "history_weight": 0.3,
            },
        )

    assert response.status_code == 200
    assert response.json() == {
        "sentiment_weight": 0.5,
        "urgency_weight": 0.2,
        "history_weight": 0.3,
    }
    mock_config_service.update_config.assert_called_once_with(
        key="priority-weights",
        value={
            "sentiment_weight": 0.5,
            "urgency_weight": 0.2,
            "history_weight": 0.3,
        },
        changed_by="admin",
    )
    app.dependency_overrides.clear()
