"""Internal data models for customer-related MongoDB collections."""

from datetime import datetime
from pydantic import BaseModel, Field


class OrderLineItem(BaseModel):
    """Line item embedded document inside CustomerOrderDocument."""

    product_id: str
    product_name: str
    quantity: int
    price: float


class CustomerOrderDocument(BaseModel):
    """MongoDB document schema for orders collection (denormalized)."""

    order_id: str = Field(alias="_id")
    customer_id: str
    order_number: str
    ordered_at: datetime
    total_amount: float
    status: str
    line_items: list[OrderLineItem] = Field(default_factory=list)
    cancellation_flag: bool = False
    synced_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class CustomerFeatureLogsDocument(BaseModel):
    """MongoDB document schema for customer_feature_logs collection."""

    customer_id: str
    historical_order_count: int = 0
    total_spent_usd: float = 0.0
    last_interaction_date: datetime | None = None
    derived_segments: list[str] = Field(default_factory=list)
    behavioral_flags: list[str] = Field(default_factory=list)
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
