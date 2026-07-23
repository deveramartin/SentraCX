"""MongoDB repository for AI configurations and audit logs."""

from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.config_models import ConfigDocument, ConfigAuditLogDocument


class ConfigRepository:
    """Repository for managing configurations and audit logs in MongoDB."""

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self._config_collection = database["config"]
        self._audit_collection = database["config_audit"]

    async def get_config(self, key: str) -> dict | None:
        """Fetch config by key from MongoDB."""
        doc = await self._config_collection.find_one({"_id": key})
        if doc:
            return doc.get("value")
        return None

    async def save_config(self, key: str, value: dict) -> None:
        """Insert or replace a config document in MongoDB."""
        config_doc = ConfigDocument(key=key, value=value, updated_at=datetime.now(timezone.utc))
        doc = config_doc.model_dump(by_alias=True)
        await self._config_collection.replace_one(
            {"_id": key},
            doc,
            upsert=True
        )

    async def log_audit(self, key: str, changed_by: str, old_value: dict | None, new_value: dict) -> None:
        """Record a configuration change event in the audit log."""
        audit_doc = ConfigAuditLogDocument(
            key=key,
            changed_by=changed_by,
            old_value=old_value,
            new_value=new_value,
            changed_at=datetime.now(timezone.utc)
        )
        doc = audit_doc.model_dump(by_alias=True)
        await self._audit_collection.insert_one(doc)

    async def get_audit_logs(self, key: str | None = None) -> list[dict]:
        """Fetch audit log history, optionally filtered by config key."""
        query = {"key": key} if key else {}
        cursor = self._audit_collection.find(query).sort("changed_at", -1)
        results = []
        async for doc in cursor:
            results.append(doc)
        return results
