"""MongoDB repository for CRM ticket records."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.ticket_models import TicketDocument


class TicketRepository:
    """Repository for managing denormalized ticket documents in MongoDB."""

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self._collection = database["tickets"]

    async def upsert_ticket(self, ticket: TicketDocument) -> None:
        """Insert or update a ticket document."""
        doc = ticket.model_dump(by_alias=True)
        await self._collection.replace_one(
            {"_id": ticket.ticket_id},
            doc,
            upsert=True
        )

    async def get_ticket(self, ticket_id: str) -> dict | None:
        """Fetch ticket by ID."""
        return await self._collection.find_one({"_id": ticket_id})
