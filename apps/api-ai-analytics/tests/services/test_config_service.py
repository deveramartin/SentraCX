"""Unit tests for ConfigService."""

from unittest.mock import AsyncMock
import pytest
from app.services.config_service import ConfigService, DEFAULT_CONFIGS


@pytest.fixture
def mock_config_repo():
    repo = AsyncMock()
    repo.get_config = AsyncMock(return_value=None)
    repo.save_config = AsyncMock()
    repo.log_audit = AsyncMock()
    repo.get_audit_logs = AsyncMock(return_value=[])
    return repo


@pytest.fixture
def mock_cache_repo():
    repo = AsyncMock()
    repo.get_config = AsyncMock(return_value=None)
    repo.set_config = AsyncMock()
    repo.invalidate = AsyncMock()
    return repo


@pytest.fixture
def service(mock_config_repo, mock_cache_repo):
    return ConfigService(
        config_repo=mock_config_repo,
        cache_repo=mock_cache_repo,
    )


async def test_get_config_cache_hit(service, mock_cache_repo, mock_config_repo):
    """When cache has config, return from cache and do not hit Mongo or write default."""
    mock_cache_repo.get_config.return_value = {"churn_threshold": 0.35}

    result = await service.get_config("churn-threshold")

    assert result == {"churn_threshold": 0.35}
    mock_cache_repo.get_config.assert_called_once_with("churn-threshold")
    mock_config_repo.get_config.assert_not_called()


async def test_get_config_cache_miss_mongo_hit(service, mock_cache_repo, mock_config_repo):
    """When cache misses but Mongo has config, retrieve, cache, and return."""
    mock_cache_repo.get_config.return_value = None
    mock_config_repo.get_config.return_value = {"churn_threshold": 0.45}

    result = await service.get_config("churn-threshold")

    assert result == {"churn_threshold": 0.45}
    mock_cache_repo.get_config.assert_called_once_with("churn-threshold")
    mock_config_repo.get_config.assert_called_once_with("churn-threshold")
    mock_cache_repo.set_config.assert_called_once_with("churn-threshold", {"churn_threshold": 0.45})


async def test_get_config_cache_miss_mongo_miss_fallback(service, mock_cache_repo, mock_config_repo):
    """When both miss, return default values, save to Mongo, and cache in Redis."""
    mock_cache_repo.get_config.return_value = None
    mock_config_repo.get_config.return_value = None

    result = await service.get_config("churn-threshold")

    expected_default = DEFAULT_CONFIGS["churn-threshold"]
    assert result == expected_default
    mock_config_repo.save_config.assert_called_once_with("churn-threshold", expected_default)
    mock_cache_repo.set_config.assert_called_once_with("churn-threshold", expected_default)


async def test_update_config(service, mock_cache_repo, mock_config_repo):
    """When updating config, save to Mongo, audit log, and update Redis cache."""
    mock_config_repo.get_config.return_value = {"churn_threshold": 0.50}

    new_value = {"churn_threshold": 0.75}
    result = await service.update_config("churn-threshold", new_value, changed_by="admin@sentracx.com")

    assert result == new_value
    mock_config_repo.save_config.assert_called_once_with("churn-threshold", new_value)
    mock_config_repo.log_audit.assert_called_once_with(
        key="churn-threshold",
        changed_by="admin@sentracx.com",
        old_value={"churn_threshold": 0.50},
        new_value=new_value,
    )
    mock_cache_repo.set_config.assert_called_once_with("churn-threshold", new_value)
