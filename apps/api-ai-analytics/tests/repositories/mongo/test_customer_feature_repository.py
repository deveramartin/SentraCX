from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from bson import ObjectId

from app.repositories.mongo.customer_feature_repository import CustomerFeatureRepository


@pytest.fixture
def collection() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def database(collection: AsyncMock) -> MagicMock:
    db = MagicMock()
    db.__getitem__ = MagicMock(return_value=collection)
    return db


@pytest.fixture
def repository(database: MagicMock) -> CustomerFeatureRepository:
    return CustomerFeatureRepository(database)


class TestSaveFeatureLog:
    async def test_inserts_document_with_customer_id_features_and_recorded_at(
        self, repository: CustomerFeatureRepository, collection: AsyncMock
    ) -> None:
        features = {"login_count_30d": 12, "avg_session_minutes": 8.5}
        fake_id = ObjectId()
        collection.insert_one.return_value = MagicMock(inserted_id=fake_id)

        with patch(
            "app.repositories.mongo.customer_feature_repository.datetime"
        ) as mock_dt:
            fixed_now = datetime(2026, 7, 17, 0, 0, 0, tzinfo=timezone.utc)
            mock_dt.now.return_value = fixed_now
            mock_dt.side_effect = lambda *a, **kw: datetime(*a, **kw)

            await repository.save_feature_log("cust-001", features)

        collection.insert_one.assert_awaited_once()
        inserted_doc = collection.insert_one.call_args[0][0]
        assert inserted_doc["customer_id"] == "cust-001"
        assert inserted_doc["features"] == features
        assert inserted_doc["recorded_at"] == fixed_now

    async def test_returns_inserted_id_as_string(
        self, repository: CustomerFeatureRepository, collection: AsyncMock
    ) -> None:
        fake_id = ObjectId()
        collection.insert_one.return_value = MagicMock(inserted_id=fake_id)

        result = await repository.save_feature_log("cust-002", {"x": 1})

        assert result == str(fake_id)
        assert isinstance(result, str)


class TestGetLatestFeatures:
    async def test_returns_none_when_no_document_found(
        self, repository: CustomerFeatureRepository, collection: AsyncMock
    ) -> None:
        collection.find_one.return_value = None

        result = await repository.get_latest_features("cust-nonexistent")

        assert result is None

    async def test_returns_features_dict_from_most_recent_document(
        self, repository: CustomerFeatureRepository, collection: AsyncMock
    ) -> None:
        features = {"login_count_30d": 5, "support_tickets_open": 2}
        collection.find_one.return_value = {
            "_id": ObjectId(),
            "customer_id": "cust-003",
            "features": features,
            "recorded_at": datetime(2026, 7, 16, 12, 0, 0, tzinfo=timezone.utc),
        }

        result = await repository.get_latest_features("cust-003")

        assert result == features

    async def test_sorts_by_recorded_at_descending(
        self, repository: CustomerFeatureRepository, collection: AsyncMock
    ) -> None:
        collection.find_one.return_value = None

        await repository.get_latest_features("cust-004")

        collection.find_one.assert_awaited_once_with(
            {"customer_id": "cust-004"},
            sort=[("recorded_at", -1)],
        )
