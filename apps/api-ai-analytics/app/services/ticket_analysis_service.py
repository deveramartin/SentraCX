"""Ticket analysis service."""

from datetime import datetime, timezone
import time
from app.lib.crm_client import CrmClient
from app.ml.ticket_analyzer import TicketAnalyzer
from app.repositories.redis.ticket_sentiment_repository import TicketSentimentRepository
from app.repositories.mongo.conversation_transcript_repository import ConversationTranscriptRepository
from app.schemas.ticket_schemas import TicketAnalysisRequest, TicketAnalysisResponse

class TicketNotFoundError(Exception):
    """Raised when a ticket is not found in the CRM."""
    pass

class CrmUnavailableError(Exception):
    """Raised when the CRM API is unavailable."""
    pass

class TicketAnalysisService:
    """Service for analyzing ticket sentiment, category, and urgency."""

    def __init__(
        self,
        crm_client: CrmClient,
        analyzer: TicketAnalyzer,
        redis_repo: TicketSentimentRepository,
        mongo_repo: ConversationTranscriptRepository
    ) -> None:
        self._crm_client = crm_client
        self._analyzer = analyzer
        self._redis_repo = redis_repo
        self._mongo_repo = mongo_repo

    async def analyze_ticket(self, request: TicketAnalysisRequest) -> TicketAnalysisResponse:
        """Run analysis on a ticket, using cache if available."""
        if not request.ticket_id:
            raise ValueError("ticket_id is required")
            
        ticket_id = request.ticket_id

        # 1. Check Redis cache
        cached = await self._redis_repo.get_cached_analysis(ticket_id)
        if cached:
            return TicketAnalysisResponse(
                ticket_id=ticket_id,
                sentiment=cached["sentiment"],
                sentiment_score=cached["sentiment_score"],
                predicted_category=cached["predicted_category"],
                urgency_score=cached["urgency_score"],
                reasoning=cached.get("reasoning", ""),
                computed_at=datetime.fromisoformat(cached["analyzed_at"]),
                cached=True
            )

        # 2. Fetch ticket from CRM
        try:
            ticket = await self._crm_client.get_ticket(ticket_id)
        except Exception as e:
            raise CrmUnavailableError("CRM is unavailable") from e
            
        if ticket is None:
            raise TicketNotFoundError(f"Ticket {ticket_id} not found")

        # 3. Fetch messages from CRM
        messages = []
        if request.include_messages:
            try:
                messages_data = await self._crm_client.get_ticket_messages(ticket_id)
                messages = [msg["content"] for msg in messages_data if "content" in msg]
            except Exception as e:
                raise CrmUnavailableError("CRM is unavailable") from e

        title = ticket.get("title", "")
        description = ticket.get("description", "")
        if request.text:
            description += "\n" + request.text

        # 5. Run analysis
        analysis = await self._analyzer.analyze(title, description, messages)
        
        # 6. Cache full result
        timestamp = time.time()
        analyzed_at = datetime.fromtimestamp(timestamp, timezone.utc)
        
        cache_data = {
            "sentiment": analysis["sentiment"],
            "sentiment_score": analysis["sentiment_score"],
            "predicted_category": analysis["category"],
            "urgency_score": analysis["urgency_score"],
            "reasoning": analysis.get("reasoning", ""),
            "analyzed_at": analyzed_at.isoformat(),
        }
        await self._redis_repo.set_cached_analysis(ticket_id, cache_data, ttl=3600)

        # 7. Add sentiment score to Redis Sorted Set
        await self._redis_repo.add_sentiment_score(ticket_id, analysis["sentiment_score"], timestamp)

        # 8. Save to MongoDB
        transcript_text = f"Title: {title}\nDescription: {description}\n"
        if messages:
            transcript_text += "Messages:\n" + "\n".join(f"- {msg}" for msg in messages)
            
        mongo_data = {
            "full_transcript_text": transcript_text,
            "sentiment": analysis["sentiment"],
            "sentiment_score": analysis["sentiment_score"],
            "predicted_category": analysis["category"],
            "urgency_score": analysis["urgency_score"],
            "reasoning": analysis.get("reasoning", "")
        }
        await self._mongo_repo.save_analysis(ticket_id, mongo_data)

        # 9. Return response
        return TicketAnalysisResponse(
            ticket_id=ticket_id,
            sentiment=analysis["sentiment"],
            sentiment_score=analysis["sentiment_score"],
            predicted_category=analysis["category"],
            urgency_score=analysis["urgency_score"],
            reasoning=analysis.get("reasoning", ""),
            computed_at=analyzed_at,
            cached=False
        )
