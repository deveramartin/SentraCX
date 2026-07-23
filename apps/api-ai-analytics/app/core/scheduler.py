"""APScheduler setup and background synchronization tasks."""

import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.core.config import get_settings
from app.db.mongo import get_database
from app.lib.oos_client import OosClient
from app.repositories.mongo.order_repository import OrderRepository
from app.services.order_ingestion_service import OrderIngestionService

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def sync_orders_job() -> None:
    """Scheduled job to sync orders from api-oos (Epic A.3)."""
    logger.info("Executing scheduled order sync job...")
    try:
        settings = get_settings()
        db = get_database()

        oos_client = OosClient(
            base_url=settings.oos_api_base_url,
            service_token=settings.oos_service_token,
        )
        order_repo = OrderRepository(db)
        ingestion_service = OrderIngestionService(oos_client, order_repo)

        synced = await ingestion_service.sync_recent_orders()
        logger.info("Scheduled order sync complete. Synced %d orders.", synced)
    except Exception as e:
        logger.error("Failed to run scheduled order sync: %s", e)


def start_scheduler() -> None:
    """Start the APScheduler background tasks."""
    if not scheduler.running:
        # Schedule nightly sync at 02:00
        scheduler.add_job(
            sync_orders_job, "cron", hour=2, minute=0, id="nightly_order_sync"
        )
        scheduler.start()
        logger.info("APScheduler started with nightly_order_sync job.")


def stop_scheduler() -> None:
    """Shutdown the APScheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler shut down.")
