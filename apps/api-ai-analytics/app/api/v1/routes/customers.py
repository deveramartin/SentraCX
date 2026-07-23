"""Customer Insights API routes."""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status

from app.api.v1.deps import get_customer_insights_service
from app.schemas.customer_schemas import (
    CustomerInsightsResponse,
    CustomerSegmentResponse,
    ChurnScoreResponse,
    ClvResponse,
    NextActionResponse,
    NextActionFeedbackRequest,
)
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


@router.get(
    "/{customer_id}/segment",
    response_model=CustomerSegmentResponse,
    summary="Get customer segment",
    description="Returns the AI-predicted customer segment.",
)
async def get_customer_segment(customer_id: str) -> CustomerSegmentResponse:
    """Get the customer segment category and model confidence."""
    # Mock response
    return CustomerSegmentResponse(
        segment="VIP",
        computed_at=datetime.now(timezone.utc),
        confidence=0.92,
    )


@router.get(
    "/{customer_id}/churn-score",
    response_model=ChurnScoreResponse,
    summary="Get customer churn score",
    description="Returns the churn risk score, risk level, and contributing factors.",
)
async def get_customer_churn_score(customer_id: str) -> ChurnScoreResponse:
    """Get customer churn score details."""
    # Mock response
    return ChurnScoreResponse(
        score=0.15,
        risk_level="low",
        contributing_factors=["recent ticket resolved successfully"],
        computed_at=datetime.now(timezone.utc),
    )


@router.get(
    "/{customer_id}/clv",
    response_model=ClvResponse,
    summary="Get customer lifetime value",
    description="Returns the predicted customer lifetime value (CLV).",
)
async def get_customer_clv(customer_id: str) -> ClvResponse:
    """Get customer predicted lifetime value."""
    # Mock response
    return ClvResponse(
        predicted_clv=1250.00,
        currency="USD",
        computed_at=datetime.now(timezone.utc),
    )


@router.get(
    "/{customer_id}/next-action",
    response_model=NextActionResponse,
    summary="Get customer next action",
    description="Returns the recommended next-best-action for the customer.",
)
async def get_customer_next_action(customer_id: str) -> NextActionResponse:
    """Get customer next action recommendation."""
    # Mock response
    return NextActionResponse(
        action="offer_loyalty_discount",
        reason="Customer has low churn risk and high value, but hasn't ordered in 30 days.",
        confidence=0.85,
        computed_at=datetime.now(timezone.utc),
    )


@router.post(
    "/{customer_id}/next-action/feedback",
    status_code=status.HTTP_200_OK,
    summary="Submit next action feedback",
    description="Logs user accept/dismiss/complete feedback for the recommended next-best-action.",
)
async def submit_next_action_feedback(
    customer_id: str,
    request: NextActionFeedbackRequest,
) -> dict[str, str]:
    """Submit next-best-action feedback for model tuning."""
    # Mock logging feedback
    return {
        "status": "success",
        "message": f"Feedback '{request.feedback}' logged for customer {customer_id}",
    }

