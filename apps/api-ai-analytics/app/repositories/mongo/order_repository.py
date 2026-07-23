"""MongoDB repository for OOS order records."""

from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.customer_models import CustomerOrderDocument


class OrderRepository:
    """Repository for managing denormalized order documents in MongoDB."""

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self._collection = database["orders"]

    async def upsert_order(self, order: CustomerOrderDocument) -> None:
        """Insert or update an order document."""
        # Convert to dictionary using model aliases/field names for MongoDB compatibility
        doc = order.model_dump(by_alias=True)
        await self._collection.replace_one(
            {"_id": order.order_id},
            doc,
            upsert=True
        )

    async def get_customer_orders(self, customer_id: str) -> list[dict]:
        """Fetch all denormalized orders for a customer."""
        cursor = self._collection.find({"customer_id": customer_id}).sort("ordered_at", -1)
        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def get_latest_order_time(self) -> datetime | None:
        """Find the timestamp of the most recently ordered item."""
        doc = await self._collection.find_one(
            filter={},
            sort=[("ordered_at", -1)]
        )
        if doc:
            # Handle string vs datetime parsing from MongoDB
            ordered_at = doc.get("ordered_at")
            if isinstance(ordered_at, str):
                return datetime.fromisoformat(ordered_at.replace("Z", "+00:00"))
            return ordered_at
        return None
