"""Tests for the Order Ingestion Service."""

from datetime import datetime, timezone
from unittest.mock import AsyncMock
import pytest

from app.lib.oos_client import OosClient, OosClientError
from app.repositories.mongo.order_repository import OrderRepository
from app.services.order_ingestion_service import OrderIngestionService


@pytest.fixture
def oos_client() -> AsyncMock:
    return AsyncMock(spec=OosClient)


@pytest.fixture
def order_repo() -> AsyncMock:
    return AsyncMock(spec=OrderRepository)


@pytest.fixture
def service(oos_client: AsyncMock, order_repo: AsyncMock) -> OrderIngestionService:
    return OrderIngestionService(oos_client, order_repo)


async def test_sync_recent_orders_success(
    service: OrderIngestionService, oos_client: AsyncMock, order_repo: AsyncMock
) -> None:
    # Set up mock timestamps and orders
    last_sync = datetime(2026, 7, 23, 12, 0, 0, tzinfo=timezone.utc)
    order_repo.get_latest_order_time.return_value = last_sync

    raw_orders = [
        {
            "id": "order-uuid-1",
            "customer_id": "cust-uuid-1",
            "order_number": "ORD-001",
            "ordered_at": "2026-07-23T14:00:00Z",
            "total_amount": 150.0,
            "status": "Completed",
            "line_items": [
                {
                    "product_id": "prod-1",
                    "product_name": "Premium Beans",
                    "quantity": 2,
                    "price": 75.0,
                }
            ],
            "cancellation_flag": False,
        }
    ]
    oos_client.get_orders.return_value = raw_orders

    synced = await service.sync_recent_orders()

    assert synced == 1
    order_repo.get_latest_order_time.assert_called_once()
    oos_client.get_orders.assert_called_once_with(since=last_sync)
    order_repo.upsert_order.assert_called_once()


async def test_sync_recent_orders_client_error(
    service: OrderIngestionService, oos_client: AsyncMock, order_repo: AsyncMock
) -> None:
    order_repo.get_latest_order_time.return_value = None
    oos_client.get_orders.side_effect = OosClientError("API failed")

    synced = await service.sync_recent_orders()

    assert synced == 0
    order_repo.upsert_order.assert_not_called()
