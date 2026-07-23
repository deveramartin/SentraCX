# Epic C: Confidence, Fallback & Degradation (Implementation Plan)

This epic ensures that SentraCX gracefully handles uncertainty in AI predictions and system outages. It implements confidence thresholds in `api-ai-analytics`, resilient HTTP calls (circuit breakers) in `api-crm`, and clear degraded UI states in `web-crm`.

## Proposed Changes

### `api-ai-analytics` (Python/FastAPI)

Updates to enforce confidence thresholds before returning results to clients. Confidence fields already exist in the Pydantic schemas.

#### [MODIFY] `app/core/config.py`
- Add `CONFIDENCE_THRESHOLD_TICKET: float = 0.6`
- Add `CONFIDENCE_THRESHOLD_SENTIMENT: float = 0.6`

#### [MODIFY] `app/services/ticket_analysis_service.py`
- Apply threshold logic to `analyze_ticket_text`.
- If `confidence < CONFIDENCE_THRESHOLD_TICKET`, override category to `"Uncategorized"`.
- If `confidence < CONFIDENCE_THRESHOLD_SENTIMENT`, override sentiment to `"Neutral/Unclassified"`.

#### [NEW] `app/api/v1/routes/health.py`
- Expose `GET /api/ai/health/status`.
- Return 503 if the service has marked itself as degraded in Redis (e.g., `ai:health:degraded`), else 200.

---

### `api-crm` (.NET 10)

Updates to ensure robust cross-service communication using Polly Resilience pipelines, and graceful fallback when `api-ai-analytics` is unavailable.

#### [MODIFY] `Crm.Api.csproj`
- Add `<PackageReference Include="Microsoft.Extensions.Http.Resilience" Version="10.*" />`

#### [NEW] `Extensions/HttpClientServiceExtensions.cs`
- Register `AiAnalyticsClient` using `.AddStandardResilienceHandler()` for automated retries, timeouts, and circuit breaking.

#### [NEW] `Interfaces/Clients/IAiAnalyticsClient.cs`
#### [NEW] `Clients/AiAnalyticsClient.cs`
- Centralized client for calling `api-ai-analytics` (implementing Epic B endpoints).
- Includes health checking logic to prime the circuit breaker.

#### [MODIFY] `Services/TicketService.cs`
- Wrap calls to `IAiAnalyticsClient.AnalyzeTicketAsync()` in a try-catch.
- If a `Polly.TimeoutRejectedException` or `BrokenCircuitException` is caught, default the ticket to `"Uncategorized"` and proceed with ticket creation without failing the user's request.

---

### `web-crm` (Next.js / React)

Updates to visually differentiate AI output and handle missing AI data gracefully.

#### [NEW] `components/ui/ai-badge.tsx`
- A shared UI component (e.g., purple border, Sparkle icon) to wrap or tag AI-suggested values.

#### [MODIFY] `app/tickets/components/TicketDetail.tsx` (or similar)
- Use `AiBadge` for sentiment and categorization if they are AI-derived.
- If the AI is unavailable and falls back to "Uncategorized", render standard text without the AI badge.

## Verification Plan

### Automated Tests
- **`api-ai-analytics`:** Unit tests for `ticket_analysis_service.py` validating that low confidence input returns "Uncategorized".
- **`api-crm`:** Unit tests in `TicketServiceTests.cs` using a mocked `IAiAnalyticsClient` that throws exceptions to verify fallback logic.

### Manual Verification
1. Run both services. Artificially lower the confidence output in the Python ML mock and verify that `api-crm` receives and saves "Uncategorized".
2. Turn off `api-ai-analytics` completely. Attempt to create a ticket in `web-crm` / `api-crm`. Verify that ticket creation succeeds immediately (or after a fast timeout) and defaults to "Uncategorized".
