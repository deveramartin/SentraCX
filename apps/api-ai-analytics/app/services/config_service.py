"""Service for managing AI configurations and caching logic."""

import logging
from app.repositories.mongo.config_repository import ConfigRepository
from app.repositories.redis.config_cache_repository import ConfigCacheRepository

logger = logging.getLogger(__name__)

# Fallback default values for configurations if not set in database
DEFAULT_CONFIGS = {
    "churn-threshold": {"churn_threshold": 0.60},
    "priority-weights": {
        "sentiment_weight": 0.40,
        "urgency_weight": 0.30,
        "history_weight": 0.30,
    },
    "anomaly-sensitivity": {"sensitivity": 0.50},
    "confidence-thresholds": {
        "sentiment_threshold": 0.70,
        "category_threshold": 0.70,
        "nba_threshold": 0.70,
        "resolution_estimate_threshold": 0.70,
    },
}


class ConfigService:
    """Orchestrates configuration updates, audits, and hot caching."""

    def __init__(
        self,
        config_repo: ConfigRepository,
        cache_repo: ConfigCacheRepository,
    ) -> None:
        self._config_repo = config_repo
        self._cache_repo = cache_repo

    async def get_config(self, key: str) -> dict:
        """Fetch config, checking Redis cache first, falling back to Mongo, then defaults."""
        try:
            # 1. Try Redis cache
            cached = await self._cache_repo.get_config(key)
            if cached is not None:
                return cached
        except Exception as e:
            logger.warning("Redis cache read failed for config key %s: %s", key, e)

        # 2. Try MongoDB
        value = await self._config_repo.get_config(key)
        if value is None:
            # 3. Fallback to hardcoded defaults if not in DB
            value = DEFAULT_CONFIGS.get(key, {})
            # Save default to database to initialize
            await self._config_repo.save_config(key, value)

        # 4. Cache in Redis
        try:
            await self._cache_repo.set_config(key, value)
        except Exception as e:
            logger.warning("Redis cache write failed for config key %s: %s", key, e)

        return value

    async def update_config(self, key: str, value: dict, changed_by: str) -> dict:
        """Update config, audit changes, and update Redis cache."""
        # 1. Fetch old value for audit logging (bypass cache to get actual database state)
        old_value = await self._config_repo.get_config(key)
        if old_value is None:
            old_value = DEFAULT_CONFIGS.get(key)

        # 2. Persist new value in MongoDB
        await self._config_repo.save_config(key, value)

        # 3. Audit log the change
        await self._config_repo.log_audit(
            key=key,
            changed_by=changed_by,
            old_value=old_value,
            new_value=value,
        )

        # 4. Update Redis cache
        try:
            await self._cache_repo.set_config(key, value)
        except Exception as e:
            logger.warning("Redis cache update failed for config key %s: %s", key, e)

        return value

    async def get_audit_logs(self, key: str | None = None) -> list[dict]:
        """Fetch audit trail history."""
        return await self._config_repo.get_audit_logs(key)
