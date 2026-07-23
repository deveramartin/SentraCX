"""Health check API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
import redis.asyncio as aioredis
from app.db.redis import get_redis_client

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/status")
async def get_health_status(
    redis_client: aioredis.Redis = Depends(get_redis_client)
) -> dict:
    """Check if the AI analytics service is healthy or degraded."""
    try:
        # Check if the service is marked as degraded in Redis
        degraded = await redis_client.get("ai:health:degraded")
        if degraded in ["true", "1", True]:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service is degraded"
            )
        # Check if Redis itself is responsive
        await redis_client.ping()
        return {"status": "healthy"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Health check failed: {str(e)}"
        )
