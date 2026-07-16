"""Redis async client setup and lifecycle."""

import redis.asyncio as aioredis

_redis: aioredis.Redis | None = None


async def connect_redis(url: str) -> None:
    """Initialize Redis connection."""
    global _redis
    _redis = aioredis.from_url(
        url,
        decode_responses=True,
        max_connections=20,
    )
    # Verify connection
    await _redis.ping()


async def close_redis() -> None:
    """Close Redis connection."""
    global _redis
    if _redis:
        await _redis.close()
        _redis = None


def get_redis_client() -> aioredis.Redis:
    """Get the Redis client instance.

    Raises RuntimeError if called before connect_redis().
    """
    if _redis is None:
        raise RuntimeError("Redis not initialized. Call connect_redis() first.")
    return _redis
