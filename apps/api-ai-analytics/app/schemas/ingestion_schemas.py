"""Pydantic schemas for data ingestion from other services (CRM, OOS)."""

from datetime import datetime
from pydantic import BaseModel, Field


class OrderLineItemSyncDto(BaseModel):
    """Line item schema within an order sync payload."""

    product_id: str
    product_name: str
    quantity: int = Field(gt=0)
    price: float = Field(ge=0.0)


class OrderSyncDto(BaseModel):
    """Order payload synced from api-oos (Epic A.3)."""

    id: str = Field(description="Order ID (UUID format)")
    customer_id: str = Field(description="Customer ID (UUID format)")
    order_number: str
    ordered_at: datetime
    total_amount: float = Field(ge=0.0)
    status: str
    line_items: list[OrderLineItemSyncDto] = Field(default_factory=list)
    cancellation_flag: bool = Field(default=False)


class TicketEventDto(BaseModel):
    """Ticket event payload received from api-crm (Epic A.4)."""

    ticket_id: str
    customer_id: str
    category: str | None = None
    status: str
    title: str
    description: str
    created_at: datetime
    updated_at: datetime


class MessageEventDto(BaseModel):
    """Message event payload received from api-crm (Epic A.4)."""

    message_id: str
    ticket_id: str
    sender_id: str
    content: str
    sent_at: datetime
