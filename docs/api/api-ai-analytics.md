# @api-ai-analytics — API Documentation

> SentraCX AI Analytics API • FastAPI • Port 4005

## Overview

The AI Analytics API provides intelligent insights, predictions, and analytics for CRM data. It powers dashboards, reports, and AI-assisted recommendations.

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:4005` |
| Production  | `https://ai.sentracx.com` |

## Interactive Documentation (Scalar)

When running, Scalar API reference is available at:

```
http://localhost:4005/docs
```

ReDoc (alternative):

```
http://localhost:4005/redoc
```

OpenAPI specification:

```
http://localhost:4005/openapi.json
```

## Authentication

All endpoints (except `/health`) require a valid JWT Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

### Analytics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/analytics/dashboard` | Dashboard summary metrics |
| GET | `/api/v1/analytics/revenue` | Revenue analytics (time series) |
| GET | `/api/v1/analytics/pipeline` | Deal pipeline analytics |
| GET | `/api/v1/analytics/activity` | Activity/engagement metrics |

### AI Insights

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/insights/deal-score` | Predict deal close probability |
| POST | `/api/v1/insights/next-action` | Suggest next best action for a contact |
| POST | `/api/v1/insights/churn-risk` | Assess customer churn risk |
| GET | `/api/v1/insights/summary/:accountId` | AI-generated account summary |

### Reports

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/reports` | List saved reports |
| POST | `/api/v1/reports` | Create/generate a report |
| GET | `/api/v1/reports/:id` | Get report by ID |
| DELETE | `/api/v1/reports/:id` | Delete a report |

## Query Parameters

### Time Range

Most analytics endpoints accept time range filters:

```
GET /api/v1/analytics/revenue?from=2026-01-01&to=2026-06-30&interval=month
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | ISO date | Start date |
| `to` | ISO date | End date |
| `interval` | string | Grouping: `day`, `week`, `month`, `quarter` |

### Filtering

```
GET /api/v1/analytics/pipeline?owner=user123&stage=negotiation
```

## Response Format

Success response:

```json
{
  "data": { ... },
  "meta": {
    "generatedAt": "2026-07-17T01:00:00Z",
    "cached": false
  }
}
```

AI insight response:

```json
{
  "data": {
    "score": 0.82,
    "confidence": "high",
    "reasoning": "Strong engagement signals and budget confirmed.",
    "suggestedActions": [
      "Schedule a follow-up meeting",
      "Send proposal revision"
    ]
  },
  "meta": {
    "model": "gpt-4o",
    "generatedAt": "2026-07-17T01:00:00Z"
  }
}
```

## Error Responses

```json
{
  "detail": "Account not found.",
  "status_code": 404
}
```

| Status | Description |
|--------|-------------|
| 400 | Bad request — invalid parameters |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 422 | Validation error — check `detail` field |
| 500 | Internal server error |
| 503 | AI service unavailable (LLM timeout) |

## Running Locally

```bash
# Setup (first time)
pnpm setup:ai

# Run
pnpm dev:ai

# Standalone
cd apps/api-ai-analytics
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 4005
```
