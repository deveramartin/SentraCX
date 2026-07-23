"""Tests for MongoDB index setup."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.db.mongo import setup_indexes


@pytest.mark.asyncio
async def test_setup_indexes():
    # Mock settings
    mock_settings = MagicMock()
    mock_settings.data_retention_days = 90

    # Mock database and collections
    mock_db = MagicMock()
    mock_collection_transcripts = AsyncMock()
    mock_collection_feature_logs = AsyncMock()

    def get_mock_collection(name):
        if name == "ConversationTranscripts":
            return mock_collection_transcripts
        elif name == "customer_feature_logs":
            return mock_collection_feature_logs
        raise ValueError(f"Unexpected collection {name}")

    mock_db.__getitem__.side_effect = get_mock_collection

    with patch("app.db.mongo._database", mock_db), \
         patch("app.core.config.get_settings", return_value=mock_settings):
        
        await setup_indexes()
        
        # Verify index creation calls
        mock_collection_transcripts.create_index.assert_called_once_with(
            "analyzed_at",
            expireAfterSeconds=90 * 24 * 60 * 60
        )
        mock_collection_feature_logs.create_index.assert_called_once_with(
            "recorded_at",
            expireAfterSeconds=90 * 24 * 60 * 60
        )
