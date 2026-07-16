# Implementation Report: AI-Analytics Customer Insights

**Date:** 2026-07-17
**Plan:** `docs/plans/implementations/ai-analytics-customer-insights.md`
**Branch:** `feature/ai-analytics-customer-insights`
**Service:** `apps/api-ai-analytics` (FastAPI / Python)

---

## Summary

Implemented the Customer Insights API for the AI-Analytics service. This is the first working
feature of the AI-Analytics microservice. It provides churn risk scores, Customer Lifetime Value
predictions, and Next-Best-Action recommendations for any given customer — consumed by the CRM
frontend via `GET /api/v1/customers/{customer_id}/insights`.

---

## What Was Built

### Endpoint

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customers/{customer_id}/insights` | Returns churn score, CLV, and NBA for a customer |

### Architecture (layered per AGENTS.md)

```
Route → Service → ML models + CRM Client + Redis Cache + MongoDB Feature Log
```

### Files Created / Modified

| File | Purpose |
|------|---------|
| `app/core/config.py` | Pydantic Settings for all env vars (Mongo, Redis, CRM, JWT) |
| `app/db/mongo.py` | Motor async MongoDB client lifecycle |
| `app/db/redis.py` | redis.asyncio client lifecycle |
| `app/lib/crm_client.py` | Async HTTP client for CRM API (httpx) |
| `app/ml/churn_model.py` | Heuristic churn risk scoring (0.0–1.0) |
| `app/ml/clv_model.py` | Heuristic CLV prediction (currency units) |
| `app/ml/nba_model.py` | Rule-based Next-Best-Action recommendation |
| `app/schemas/customer_schemas.py` | Pydantic v2 request/response schemas |
| `app/repositories/redis/customer_cache_repository.py` | Redis cache (24h TTL) |
| `app/repositories/mongo/customer_feature_repository.py` | MongoDB feature log |
| `app/services/customer_insights_service.py` | Orchestration layer |
| `app/api/v1/routes/customers.py` | FastAPI route |
| `app/api/v1/deps.py` | Dependency injection wiring |
| `app/main.py` | Lifespan (Mongo/Redis connect/disconnect) + router registration |
| `pyproject.toml` | Dependencies, build config, pytest config |
| `.env.example` | Environment variable documentation |

### Test Files (77 tests total, all passing)

| File | Tests | Covers |
|------|-------|--------|
| `tests/ml/test_churn_model.py` | 11 | Churn scoring edge cases and bounds |
| `tests/ml/test_clv_model.py` | 9 | CLV calculation, floor/cap, retention tiers |
| `tests/ml/test_nba_model.py` | 10 | All 7 decision paths + output validation |
| `tests/lib/test_crm_client.py` | 10 | HTTP responses (200/404/500/connection error) |
| `tests/schemas/test_customer_schemas.py` | 11 | Pydantic validation (valid/invalid/round-trip) |
| `tests/repositories/redis/test_customer_cache_repository.py` | 6 | Cache get/set/invalidate/TTL |
| `tests/repositories/mongo/test_customer_feature_repository.py` | 5 | Feature log save/retrieve/sort |
| `tests/services/test_customer_insights_service.py` | 8 | Cache hit/miss, CRM flow, feature building |
| `tests/api/v1/routes/test_customers.py` | 7 | HTTP 200/404/503, schema validation, health |

---

## Dependencies Installed

### Runtime Dependencies

| Package | Version | Why |
|---------|---------|-----|
| `pydantic-settings` | >=2.4.0 | Load typed config from environment variables and `.env` files |
| `motor` | >=3.6.0 | Async MongoDB driver (Motor wraps PyMongo for asyncio) |
| `redis[hiredis]` | >=5.0.0 | Async Redis client with high-performance C parser |
| `httpx` | >=0.27.0 | Async HTTP client to call CRM API; also used by FastAPI TestClient |
| `fastapi` | >=0.115.0 | Web framework (already present) |
| `uvicorn[standard]` | >=0.30.0 | ASGI server (already present) |
| `scalar-fastapi` | >=1.0.0 | API documentation UI (already present) |

### Dev Dependencies

| Package | Version | Why |
|---------|---------|-----|
| `pytest` | >=8.0.0 | Test runner |
| `pytest-asyncio` | >=0.24.0 | Async test support (asyncio_mode=auto) |
| `pytest-cov` | >=5.0.0 | Code coverage reporting |

### Where to find them

All dependencies are declared in `apps/api-ai-analytics/pyproject.toml` and installed in the
local virtualenv at `apps/api-ai-analytics/.venv/`. Install with:

```bash
cd apps/api-ai-analytics
python -m venv .venv
.venv/bin/pip install -e ".[dev]"
```

---

## How to Run

### Start the service

```bash
cd apps/api-ai-analytics
.venv/bin/uvicorn app.main:app --reload --port 4005
```

**Prerequisites:** MongoDB running on `localhost:27017` and Redis on `localhost:6379`.
Configure via `.env` file (copy `.env.example`).

### Run tests

```bash
cd apps/api-ai-analytics
.venv/bin/python -m pytest tests/ -v
```

Tests run without external services (all infrastructure mocked).

### API Documentation UI

Once the service is running, the API documentation is available at:

- **Scalar API Reference:** [http://localhost:4005/docs](http://localhost:4005/docs)
- **OpenAPI JSON:** [http://localhost:4005/openapi.json](http://localhost:4005/openapi.json)

---

## UI / Frontend Visibility

This is a backend-only feature. The endpoint `GET /api/v1/customers/{customer_id}/insights`
is consumed by the Next.js frontend (`apps/web-crm`). The frontend integration is a separate
task — this report covers only the API implementation.

To test the endpoint manually:

```bash
curl http://localhost:4005/api/v1/customers/some-customer-id/insights
```

---

## Data Flow

1. Client requests insights for a customer ID
2. Service checks Redis cache (`customer:{id}:insights`, 24h TTL)
3. On cache hit → return cached response immediately
4. On cache miss:
   - Fetch customer profile from CRM API (`GET /api/v1/customers/{id}`)
   - Fetch order history from CRM API (`GET /api/v1/customers/{id}/orders`)
   - Build feature vector (days since last order, frequency trend, ticket count, etc.)
   - Run heuristic ML models (churn → CLV → NBA)
   - Cache result in Redis (24h TTL)
   - Store feature snapshot in MongoDB (`customer_feature_logs` collection)
   - Return response

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Heuristic models (not trained ML) | Delivers immediate value; architecture supports swapping in trained models later via the `ml/` layer without changing service or route code |
| Pull-based data flow (not webhook) | Simpler initial implementation; webhook push can be added later for real-time updates |
| 24h cache TTL | Balances freshness vs. compute cost; configurable per-customer if needed later |
| MongoDB for feature logs | Flexible document shape for ML features; supports historical tracking for future model training |
| Single JSON key per customer in Redis | Simpler than multiple keys; atomic read/write of full insight set |

---

## Verification

- **77 tests passing** — covers ML models, CRM client, schemas, repositories, service logic, and HTTP routes
- **Test structure mirrors app/ 1:1** as required by AGENTS.md
- **No external services required for tests** — all infrastructure mocked with AsyncMock
- **Clean layering enforced** — route → service → repository/ML, no shortcuts
- **File size constraint met** — all files under 200 lines
