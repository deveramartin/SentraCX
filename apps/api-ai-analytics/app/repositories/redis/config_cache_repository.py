"""Redis cache repository for AI configurations."""

import json
import redis.asyncio as aioredis

_CACHE_PREFIX = "config"
_DEFAULT_TTL = 3600  # 1 hour cache duration


class ConfigCacheRepository:
    """Repository for caching configuration structures in Redis."""

    def __init__(self, redis_client: aioredis.Redis) -> None:
        self._redis = redis_client

    def _key(self, key: str) -> str:
        return f"{_CACHE_PREFIX}:{key}"

    async def get_config(self, key: str) -> dict | None:
        """Retrieve cached configuration. Returns None if cache miss."""
        data = await self._redis.get(self._key(key))
        if data is None:
            return None
        return json.loads(data)

    async def set_config(self, key: str, value: dict, ttl: int = _DEFAULT_TTL) -> None:
        """Cache configuration structure with TTL."""
        serialized = json.dumps(value)
        await self._redis.set(self._key(key), serialized, ex=ttl)

    async def invalidate(self, key: str) -> None:
        """Remove cached configuration."""
        await self._redis.delete(self._key(key))
