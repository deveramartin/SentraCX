"""Ticket API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.v1.deps import get_ticket_analysis_service
from app.schemas.ticket_schemas import TicketAnalysisRequest, TicketAnalysisResponse
from app.services.ticket_analysis_service import (
    TicketAnalysisService,
    TicketNotFoundError,
    CrmUnavailableError,
)

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.post("/analyze-intent", response_model=TicketAnalysisResponse)
async def analyze_intent(
    request: TicketAnalysisRequest,
    service: TicketAnalysisService = Depends(get_ticket_analysis_service)
) -> TicketAnalysisResponse:
    """Analyze a ticket for sentiment, category, and urgency."""
    try:
        return await service.analyze_ticket(request)
    except TicketNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CrmUnavailableError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
