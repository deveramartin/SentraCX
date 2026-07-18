"""Redis repository for ticket sentiment and analysis caching."""

import json
from redis.asyncio import Redis

class TicketSentimentRepository:
    """Repository for managing ticket sentiment streams and analysis caching in Redis."""

    def __init__(self, redis_client: Redis) -> None:
        self._redis = redis_client

    def _stream_key(self, ticket_id: str) -> str:
        return f"ticket:{ticket_id}:sentiment_stream"

    def _analysis_key(self, ticket_id: str) -> str:
        return f"ticket:{ticket_id}:analysis"

    async def add_sentiment_score(self, ticket_id: str, sentiment_score: float, timestamp: float) -> None:
        """Add a sentiment score to the ticket's sorted set history.
        
        Using timestamp:score as the member to avoid overwriting duplicate scores.
        """
        key = self._stream_key(ticket_id)
        member = f"{timestamp}:{sentiment_score}"
        await self._redis.zadd(key, {member: timestamp})

    async def get_sentiment_history(self, ticket_id: str) -> list[tuple[float, float]]:
        """Get the sentiment history for a ticket. Returns [(timestamp, score)]."""
        key = self._stream_key(ticket_id)
        results = await self._redis.zrange(key, 0, -1, withscores=True)
        
        history = []
        for member, score in results:
            # handle bytes or strings depending on redis decode_responses
            member_str = member.decode() if isinstance(member, bytes) else member
            parts = member_str.split(":", 1)
            if len(parts) == 2:
                history.append((float(score), float(parts[1])))
        return history

    async def get_cached_analysis(self, ticket_id: str) -> dict | None:
        """Get cached full analysis."""
        key = self._analysis_key(ticket_id)
        data = await self._redis.get(key)
        if data:
            return json.loads(data)
        return None

    async def set_cached_analysis(self, ticket_id: str, analysis: dict, ttl: int = 3600) -> None:
        """Cache full analysis with TTL."""
        key = self._analysis_key(ticket_id)
        await self._redis.setex(key, ttl, json.dumps(analysis))

    async def invalidate_analysis(self, ticket_id: str) -> None:
        """Invalidate cached analysis."""
        key = self._analysis_key(ticket_id)
        await self._redis.delete(key)
