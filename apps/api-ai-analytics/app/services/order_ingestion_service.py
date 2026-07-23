"""Service to orchestrate ingestion and ETL of orders from OOS (Epic A.2, A.3)."""

import logging
from app.lib.oos_client import OosClient, OosClientError
from app.repositories.mongo.order_repository import OrderRepository
from app.schemas.ingestion_schemas import OrderSyncDto
from app.models.customer_models import CustomerOrderDocument, OrderLineItem

logger = logging.getLogger(__name__)


class OrderIngestionService:
    """Orchestrates order synchronization from api-oos into MongoDB."""

    def __init__(self, oos_client: OosClient, order_repository: OrderRepository) -> None:
        self._oos_client = oos_client
        self._order_repo = order_repository

    async def sync_recent_orders(self) -> int:
        """Fetch and persist orders since the last stored order timestamp.

        Returns:
            The count of synchronized orders.
        """
        try:
            since = await self._order_repo.get_latest_order_time()
            logger.info("Starting order sync since: %s", since)

            raw_orders = await self._oos_client.get_orders(since=since)
            logger.info("Fetched %d raw orders from OOS", len(raw_orders))

            sync_count = 0
            for raw_order in raw_orders:
                try:
                    # Validate incoming payload against schema
                    dto = OrderSyncDto.model_validate(raw_order)

                    # Transform DTO to MongoDB document representation
                    line_items = [
                        OrderLineItem(
                            product_id=item.product_id,
                            product_name=item.product_name,
                            quantity=item.quantity,
                            price=item.price,
                        )
                        for item in dto.line_items
                    ]

                    doc = CustomerOrderDocument(
                        order_id=dto.id,
                        customer_id=dto.customer_id,
                        order_number=dto.order_number,
                        ordered_at=dto.ordered_at,
                        total_amount=dto.total_amount,
                        status=dto.status,
                        line_items=line_items,
                        cancellation_flag=dto.cancellation_flag,
                    )

                    await self._order_repo.upsert_order(doc)
                    sync_count += 1
                except Exception as e:
                    logger.error("Failed to process order payload %s: %s", raw_order.get("id"), e)
                    continue

            logger.info("Successfully synced %d orders to MongoDB", sync_count)
            return sync_count

        except OosClientError as e:
            logger.error("OosClient error occurred during sync: %s", e)
            return 0
        except Exception as e:
            logger.error("Unexpected error during order sync: %s", e)
            return 0
