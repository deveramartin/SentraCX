import json
from unittest.mock import AsyncMock

import pytest

from app.repositories.redis.customer_cache_repository import CustomerCacheRepository


@pytest.fixture
def redis_client() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def repository(redis_client: AsyncMock) -> CustomerCacheRepository:
    return CustomerCacheRepository(redis_client)


class TestGetInsights:
    async def test_returns_none_when_no_cached_data(
        self, repository: CustomerCacheRepository, redis_client: AsyncMock
    ) -> None:
        redis_client.get.return_value = None

        result = await repository.get_insights("cust-123")

        assert result is None
        redis_client.get.assert_awaited_once_with("customer:cust-123:insights")

    async def test_returns_parsed_dict_when_data_exists(
        self, repository: CustomerCacheRepository, redis_client: AsyncMock
    ) -> None:
        cached = {"churn_score": 0.85, "clv": 1200.50}
        redis_client.get.return_value = json.dumps(cached)

        result = await repository.get_insights("cust-456")

        assert result == cached


class TestSetInsights:
    async def test_calls_redis_set_with_correct_key_serialized_json_and_default_ttl(
        self, repository: CustomerCacheRepository, redis_client: AsyncMock
    ) -> None:
        insights = {"churn_score": 0.72, "segment": "high-value"}

        await repository.set_insights("cust-789", insights)

        redis_client.set.assert_awaited_once_with(
            "customer:cust-789:insights",
            json.dumps(insights, default=str),
            ex=86400,
        )

    async def test_uses_custom_ttl_when_provided(
        self, repository: CustomerCacheRepository, redis_client: AsyncMock
    ) -> None:
        insights = {"nba": "upsell"}

        await repository.set_insights("cust-100", insights, ttl=3600)

        redis_client.set.assert_awaited_once_with(
            "customer:cust-100:insights",
            json.dumps(insights, default=str),
            ex=3600,
        )


class TestInvalidate:
    async def test_calls_redis_delete_with_correct_key(
        self, repository: CustomerCacheRepository, redis_client: AsyncMock
    ) -> None:
        await repository.invalidate("cust-999")

        redis_client.delete.assert_awaited_once_with("customer:cust-999:insights")


class TestKeyFormat:
    def test_key_format_is_customer_id_insights(
        self, repository: CustomerCacheRepository
    ) -> None:
        assert repository._key("abc-123") == "customer:abc-123:insights"
        assert repository._key("") == "customer::insights"
        assert repository._key("user@test") == "customer:user@test:insights"
