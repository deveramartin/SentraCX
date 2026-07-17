"""SentraCX AI Analytics API — application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.routes.customers import router as customers_router
from app.api.v1.routes.tickets import router as tickets_router
from app.core.config import get_settings
from app.db.mongo import close_mongo, connect_mongo
from app.db.redis import close_redis, connect_redis

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    settings = get_settings()

    # Startup
    logger.info("Connecting to MongoDB at %s", settings.mongo_uri)
    await connect_mongo(settings.mongo_uri, settings.mongo_database)
    logger.info("MongoDB connected")

    logger.info("Connecting to Redis at %s", settings.redis_url)
    await connect_redis(settings.redis_url)
    logger.info("Redis connected")

    yield

    # Shutdown
    logger.info("Closing Redis connection")
    await close_redis()
    logger.info("Closing MongoDB connection")
    await close_mongo()
    logger.info("Shutdown complete")


app = FastAPI(
    title="SentraCX - AI Analytics API",
    description="AI-powered analytics and insights service for SentraCX platform.",
    version="0.1.0",
    docs_url=None,  # Disable default Swagger UI
    lifespan=lifespan,
)

# Register routers
app.include_router(customers_router, prefix="/api/v1")
app.include_router(tickets_router, prefix="/api/v1")


@app.get("/docs", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )


@app.get("/health")
async def health_check():
    """Check the health status of the API."""
    return {"status": "healthy"}
