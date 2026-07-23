"""MongoDB repository for conversation transcripts."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from app.models.ticket_models import ConversationMessage

class ConversationTranscriptRepository:
    """Repository for managing conversation transcripts in MongoDB."""

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self._collection = database["ConversationTranscripts"]

    async def save_analysis(self, ticket_id: str, analysis_data: dict) -> None:
        """Save a new transcript analysis."""
        doc = {
            "crms_ticket_id": ticket_id,
            "full_transcript_text": analysis_data.get("full_transcript_text", ""),
            "extracted_entities": analysis_data.get("extracted_entities", []),
            "auto_summary": analysis_data.get("auto_summary", ""),
            "sentiment": analysis_data.get("sentiment", "neutral"),
            "sentiment_score": analysis_data.get("sentiment_score", 0.0),
            "predicted_category": analysis_data.get("predicted_category", "general_inquiry"),
            "urgency_score": analysis_data.get("urgency_score", 0.0),
            "reasoning": analysis_data.get("reasoning", ""),
            "analyzed_at": datetime.now(timezone.utc).isoformat()
        }
        await self._collection.insert_one(doc)

    async def append_message(self, ticket_id: str, message: ConversationMessage) -> None:
        """Append a message to the ticket's transcript document."""
        msg_dict = message.model_dump()
        sender_label = "Agent" if message.sender_id != "customer" else "Customer"
        text_append = f"\n{sender_label}: {message.content}"

        await self._collection.update_one(
            {"crms_ticket_id": ticket_id},
            {
                "$push": {"messages": msg_dict},
                "$set": {"analyzed_at": datetime.now(timezone.utc)},
                "$setOnInsert": {
                    "extracted_entities": [],
                    "auto_summary": "",
                    "sentiment": "neutral",
                    "sentiment_score": 0.0,
                    "predicted_category": "general_inquiry",
                    "urgency_score": 0.0,
                    "reasoning": ""
                }
            },
            upsert=True
        )

        # Also append to the raw full transcript text string using aggregation pipeline update
        await self._collection.update_one(
            {"crms_ticket_id": ticket_id},
            [
                {
                    "$set": {
                        "full_transcript_text": {
                            "$concat": [
                                {"$ifNull": ["$full_transcript_text", ""]},
                                text_append
                            ]
                        }
                    }
                }
            ]
        )


    async def get_latest_analysis(self, ticket_id: str) -> dict | None:
        """Get the most recent analysis for a ticket."""
        doc = await self._collection.find_one(
            {"crms_ticket_id": ticket_id},
            sort=[("analyzed_at", -1)]
        )
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_analysis_history(self, ticket_id: str) -> list[dict]:
        """Get all past analyses for a ticket."""
        cursor = self._collection.find(
            {"crms_ticket_id": ticket_id},
            sort=[("analyzed_at", -1)]
        )
        docs = []
        async for doc in cursor:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            docs.append(doc)
        return docs
