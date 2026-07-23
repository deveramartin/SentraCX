"""Dashboard, anomaly, and query analysis API endpoints."""

from datetime import datetime, timezone
from fastapi import APIRouter, Query, status

from app.schemas.dashboard_schemas import (
    DashboardSummaryResponse,
    AnomalyListResponse,
    AnomalyItem,
    NaturalLanguageQueryRequest,
    NaturalLanguageQueryResponse,
)

router = APIRouter(tags=["dashboard"])


@router.get(
    "/dashboard/summary",
    response_model=DashboardSummaryResponse,
    summary="Get dashboard aggregate summary",
    description="Retrieve combined metrics including churn, sentiment, and tickets.",
)
async def get_dashboard_summary(
    from_date: datetime = Query(alias="from", default=None, description="Start datetime filter"),
    to_date: datetime = Query(alias="to", default=None, description="End datetime filter"),
) -> DashboardSummaryResponse:
    """Get aggregate metrics over a timeframe for the analytics dashboard."""
    # Mock response
    return DashboardSummaryResponse(
        churn_rate=0.18,
        average_sentiment=0.35,
        total_tickets=150,
        resolved_tickets=130,
        active_campaigns=3,
        computed_at=datetime.now(timezone.utc),
    )


@router.get(
    "/anomalies",
    response_model=AnomalyListResponse,
    summary="Get detected anomalies",
    description="Retrieve listing of system anomalies and customer trends.",
)
async def get_anomalies(
    from_date: datetime = Query(alias="from", default=None, description="Start datetime filter"),
    to_date: datetime = Query(alias="to", default=None, description="End datetime filter"),
    status_val: str = Query(alias="status", default=None, description="Status filter (open/investigating/resolved)"),
) -> AnomalyListResponse:
    """Get list of identified anomalous trends or behaviors."""
    # Mock response
    now = datetime.now(timezone.utc)
    anomalies = [
        AnomalyItem(
            anomaly_id="anom-001",
            anomaly_type="ticket_volume_spike",
            description="Spike in ticket volume regarding billing errors",
            severity="high",
            status="open",
            detected_at=now,
        )
    ]
    return AnomalyListResponse(anomalies=anomalies)


@router.post(
    "/query",
    response_model=NaturalLanguageQueryResponse,
    summary="Natural language query",
    description="Execute a natural language query against analytics data.",
)
async def execute_natural_language_query(
    request: NaturalLanguageQueryRequest,
) -> NaturalLanguageQueryResponse:
    """Process natural language request and return structured data results."""
    # Mock response
    return NaturalLanguageQueryResponse(
        query=request.query,
        interpreted_query="SELECT COUNT(*) FROM tickets WHERE category = 'billing' AND sentiment = 'negative'",
        result={"count": 14, "timeframe": "last_30_days"},
        computed_at=datetime.now(timezone.utc),
    )
