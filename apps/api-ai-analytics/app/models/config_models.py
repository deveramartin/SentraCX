"""Internal data models for configuration-related MongoDB collections."""

from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class ConfigDocument(BaseModel):
    """MongoDB document shape for configurations collection."""

    model_config = ConfigDict(populate_by_name=True)

    key: str = Field(alias="_id")
    value: dict
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConfigAuditLogDocument(BaseModel):
    """MongoDB document shape for configuration changes audit logging."""

    model_config = ConfigDict(populate_by_name=True)

    key: str
    changed_by: str
    old_value: dict | None = None
    new_value: dict
    changed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
