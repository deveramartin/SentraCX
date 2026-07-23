"""Ticket API endpoints."""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.api.v1.deps import get_ticket_analysis_service
from app.schemas.ticket_schemas import (
    TicketAnalysisRequest,
    TicketAnalysisResponse,
    TicketAnalyzeRequest,
    TicketAnalyzeResponse,
    TicketResolutionEstimateResponse,
    TicketVolumeForecastResponse,
    ForecastPoint,
)
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


@router.post(
    "/analyze",
    response_model=TicketAnalyzeResponse,
    summary="Analyze CRM ticket",
    description="Synchronously analyze a ticket on creation for sentiment, category, and priority.",
)
async def analyze_ticket(request: TicketAnalyzeRequest) -> TicketAnalyzeResponse:
    """Analyze a ticket synchronously for priority and classification."""
    # Mock response
    return TicketAnalyzeResponse(
        sentiment="neutral",
        category="billing",
        priority_score=0.45,
        confidence=0.88,
    )


@router.get(
    "/{ticket_id}/resolution-estimate",
    response_model=TicketResolutionEstimateResponse,
    summary="Get ticket resolution estimate",
    description="Get the estimated hours to resolve a CRM ticket.",
)
async def get_ticket_resolution_estimate(ticket_id: str) -> TicketResolutionEstimateResponse:
    """Get the estimated resolution time for a specific ticket."""
    # Mock response
    return TicketResolutionEstimateResponse(
        estimated_hours=4.5,
        confidence=0.78,
    )


@router.get(
    "/volume-forecast",
    response_model=TicketVolumeForecastResponse,
    summary="Get ticket volume forecast",
    description="Get predicted ticket volumes over the specified range.",
)
async def get_ticket_volume_forecast(
    range_val: str = Query(alias="range", default="7d", description="Forecast range (e.g. 7d, 30d)")
) -> TicketVolumeForecastResponse:
    """Get a forecast of ticket volume spikes and alerts."""
    # Mock response with points
    now = datetime.now(timezone.utc)
    series = [
        ForecastPoint(timestamp=now, value=12.5),
        ForecastPoint(timestamp=now, value=15.0),
    ]
    return TicketVolumeForecastResponse(
        forecast_series=series,
        threshold=25.0,
        alert_triggered=False,
    )

