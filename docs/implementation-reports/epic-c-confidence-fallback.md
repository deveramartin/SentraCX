# Epic C: Confidence, Fallback & Degradation (Implementation Report)

This report details the implementation of Epic C across all three services in SentraCX.

## What Was Built

### 1. `api-ai-analytics` (Python/FastAPI)
- **Confidence Thresholds:** Added `confidence_threshold_ticket` (0.6) and `confidence_threshold_sentiment` (0.6) to settings (`app/core/config.py`).
- **Enforced Threshold Overrides:** Updated `app/services/ticket_analysis_service.py` to check the confidence of ML predictions.
  - If ticket categorization confidence is below threshold, it falls back to `"Uncategorized"`.
  - If sentiment confidence is below threshold, it falls back to `"neutral"`.
  - The original raw predictions and exact confidence are still stored in the MongoDB `ConversationTranscripts` collection for auditability, but overwritten on return.
- **Confidence in ML Model:** Modified `app/ml/ticket_analyzer.py` to output confidence values (updated prompt for Groq, and added keyword-based confidence estimation heuristics for fallback).
- **Service Degradation Route:** Added a `GET /api/v1/health/status` endpoint to check if the service is degraded (checks `ai:health:degraded` Redis key).

### 2. `api-crm` (.NET 10)
- **HttpClient Resilience:** Added `Microsoft.Extensions.Http.Resilience` package dependency and configured `.AddStandardResilienceHandler()` (timeouts, circuit breaker, rate limit, and retries) for the AI Client in `Extensions/HttpClientServiceExtensions.cs`.
- **AI Integration & Fallback:** Integrated `IAiAnalyticsClient` inside `Services/TicketService.cs`. In `CreateAsync`, we call `AnalyzeTicketAsync`.
- **Graceful Fallback:** If the AI call times out, rate limits, or trips the circuit breaker, the exception is caught, and the ticket defaults to category `"Uncategorized"` and sentiment `"neutral"`, allowing ticket creation to succeed without blockage.

### 3. `web-crm` (Next.js 16)
- **AiBadge Component:** Created a custom React component `src/components/ui/ai-badge.tsx` featuring a purple color token background and a `<Sparkles />` icon to represent AI-derived predictions.
- **UI Degradation Handling:** Updated `src/components/features/tickets/TicketDetailSheet.tsx` to conditionally render `AiBadge` for sentiment/category. If AI is unavailable (or falls back to "Uncategorized" / "neutral"), it renders standard text labels instead of the AI badge.

---

## Verification & Testing

### Automated Tests
1. **Python (`api-ai-analytics`):**
   - Added unit test in `tests/services/test_ticket_analysis_service.py` (`test_analyze_ticket_low_confidence_overrides`) ensuring low confidence scores successfully trigger overrides while preserving originals in Mongo.
   - Added integration tests in `tests/api/v1/routes/test_health.py` for `/health/status` (testing healthy, degraded, and Redis-error states).
   - All tests passed.
2. **.NET (`api-crm`):**
   - Added unit tests in `tests/Crm.Api.Tests/Services/TicketServiceCreateTests.cs` validating `CreateAsync` behavior:
     - `CreateAsync_ReturnsTicketWithAISuggestions_WhenAICallSucceeds`
     - `CreateAsync_ReturnsTicketWithFallback_WhenAICallThrows`
   - Modified `TicketServiceUnclaimTests.cs` to pass mocked `IAiAnalyticsClient`.
   - All tests passed.
3. **Next.js (`web-crm`):**
   - Verified that the UI compiles and all frontend Jest suites pass.
