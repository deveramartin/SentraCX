"""Customer Insights API routes."""

from fastapi import APIRouter, HTTPException, status

from app.api.v1.deps import get_customer_insights_service
from app.schemas.customer_schemas import CustomerInsightsResponse
from app.services.customer_insights_service import (
    CustomerNotFoundError,
    CrmUnavailableError,
)

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get(
    "/{customer_id}/insights",
    response_model=CustomerInsightsResponse,
    summary="Get customer insights",
    description="Returns churn score, CLV prediction, and next-best-action for a customer.",
)
async def get_customer_insights(customer_id: str) -> CustomerInsightsResponse:
    """Get AI-powered insights for a specific customer."""
    service = get_customer_insights_service()
    try:
        return await service.get_insights(customer_id)
    except CustomerNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer {customer_id} not found in CRM",
        )
    except CrmUnavailableError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CRM service is currently unavailable",
        )
