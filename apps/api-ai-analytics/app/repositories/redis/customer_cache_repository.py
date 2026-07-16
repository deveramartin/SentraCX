"""Redis cache repository for customer insights."""

import json
from datetime import datetime

import redis.asyncio as aioredis

_CACHE_PREFIX = "customer:{customer_id}:insights"
_DEFAULT_TTL = 86400  # 24 hours


class CustomerCacheRepository:
    """Repository for caching customer insights in Redis."""

    def __init__(self, redis_client: aioredis.Redis) -> None:
        self._redis = redis_client

    def _key(self, customer_id: str) -> str:
        return f"customer:{customer_id}:insights"

    async def get_insights(self, customer_id: str) -> dict | None:
        """Retrieve cached insights for a customer.

        Returns None if no cached data or cache expired.
        """
        data = await self._redis.get(self._key(customer_id))
        if data is None:
            return None
        return json.loads(data)

    async def set_insights(
        self, customer_id: str, insights: dict, ttl: int = _DEFAULT_TTL
    ) -> None:
        """Cache customer insights with TTL."""
        serialized = json.dumps(insights, default=str)
        await self._redis.set(self._key(customer_id), serialized, ex=ttl)

    async def invalidate(self, customer_id: str) -> None:
        """Remove cached insights for a customer."""
        await self._redis.delete(self._key(customer_id))
