"""Service to listen to Redis Pub/Sub for CRM ticket and message events (Epic A.4)."""

import asyncio
import json
import logging
from redis.asyncio import Redis
from app.repositories.mongo.ticket_repository import TicketRepository
from app.repositories.mongo.conversation_transcript_repository import ConversationTranscriptRepository
from app.schemas.ingestion_schemas import TicketEventDto, MessageEventDto
from app.models.ticket_models import TicketDocument, ConversationMessage

logger = logging.getLogger(__name__)


class TicketIngestionService:
    """Listens to crm:tickets and crm:messages Redis Pub/Sub channels to sync MongoDB."""

    def __init__(
        self,
        redis_client: Redis,
        ticket_repo: TicketRepository,
        transcript_repo: ConversationTranscriptRepository,
    ) -> None:
        self._redis = redis_client
        self._ticket_repo = ticket_repo
        self._transcript_repo = transcript_repo
        self._listener_task: asyncio.Task | None = None
        self._running = False

    def start(self) -> None:
        """Start the background Redis pub/sub listener."""
        self._running = True
        self._listener_task = asyncio.create_task(self._listen_loop())
        logger.info("TicketIngestionService background listener started")

    async def stop(self) -> None:
        """Stop the background Redis pub/sub listener."""
        self._running = False
        if self._listener_task:
            self._listener_task.cancel()
            try:
                await self._listener_task
            except asyncio.CancelledError:
                pass
            self._listener_task = None
            logger.info("TicketIngestionService background listener stopped")

    async def _listen_loop(self) -> None:
        pubsub = self._redis.pubsub()
        await pubsub.subscribe("crm:tickets", "crm:messages")
        logger.info("Subscribed to Redis channels: crm:tickets, crm:messages")

        while self._running:
            try:
                message = await pubsub.get_message(
                    ignore_subscribe_messages=True, timeout=1.0
                )
                if message is None:
                    continue

                channel = message["channel"]
                data = message["data"]

                if isinstance(channel, bytes):
                    channel = channel.decode("utf-8")
                if isinstance(data, bytes):
                    data = data.decode("utf-8")

                payload = json.loads(data)

                if channel == "crm:tickets":
                    await self._handle_ticket_event(payload)
                elif channel == "crm:messages":
                    await self._handle_message_event(payload)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in Redis Pub/Sub listener loop: %s", e)
                await asyncio.sleep(1.0)

        # Cleanup pubsub on shutdown
        try:
            await pubsub.unsubscribe("crm:tickets", "crm:messages")
            await pubsub.close()
        except Exception as e:
            logger.warning("Error closing pubsub subscriber: %s", e)

    async def _handle_ticket_event(self, payload: dict) -> None:
        try:
            dto = TicketEventDto.model_validate(payload)
            ticket_doc = TicketDocument(
                ticket_id=dto.ticket_id,
                customer_id=dto.customer_id,
                category=dto.category,
                status=dto.status,
                title=dto.title,
                description=dto.description,
                created_at=dto.created_at,
                updated_at=dto.updated_at,
            )
            await self._ticket_repo.upsert_ticket(ticket_doc)
            logger.info("Successfully ingested ticket event for ticket %s", dto.ticket_id)
        except Exception as e:
            logger.error(
                "Failed to process ticket event payload: %s, error: %s",
                payload,
                e,
            )

    async def _handle_message_event(self, payload: dict) -> None:
        try:
            dto = MessageEventDto.model_validate(payload)
            message_model = ConversationMessage(
                message_id=dto.message_id,
                sender_id=dto.sender_id,
                content=dto.content,
                sent_at=dto.sent_at,
            )
            await self._transcript_repo.append_message(dto.ticket_id, message_model)
            logger.info("Successfully ingested message event for ticket %s", dto.ticket_id)
        except Exception as e:
            logger.error(
                "Failed to process message event payload: %s, error: %s",
                payload,
                e,
            )
