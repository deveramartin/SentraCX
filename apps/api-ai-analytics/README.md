# api-ai-analytics

SentraCX AI & Analytics Service — FastAPI microservice that provides customer insights
(churn scoring, CLV prediction, Next-Best-Action recommendations) and ticket intelligence
(sentiment analysis, urgency scoring, auto-categorization) by consuming data from the CRM API.

## Tech Stack

- **FastAPI** — Async Python web framework
- **Pydantic v2 + pydantic-settings** — Data validation and typed config from env vars
- **Motor** — Async MongoDB driver
- **redis.asyncio** — Async Redis client (with hiredis for performance)
- **httpx** — Async HTTP client (calls CRM API)
- **Groq SDK** — LLM inference (`llama-3.1-8b-instant`) for ticket analysis and summarization
- **Uvicorn** — ASGI server

## Databases

| Store | Purpose | Default URL |
|-------|---------|-------------|
| **MongoDB** | Feature log snapshots (ML input data), conversation transcripts | `mongodb://localhost:27017` |
| **Redis** | Cache for computed insights (TTL-based auto-expiry) | `redis://localhost:6379/0` |

Both must be running before the service starts.

### Starting databases

**Redis** (installed via Homebrew on macOS):

```bash
# Start (auto-restarts on login)
brew services start redis

# Verify
redis-cli ping   # → PONG
```

**MongoDB** (installed from official Linux tarball at `~/.local/bin/mongod`):

```bash
# Start (forked background process)
mongod --dbpath ~/.local/share/mongodb/data \
       --logpath ~/.local/share/mongodb/log/mongod.log \
       --fork --port 27017

# Verify
mongosh --eval "db.runCommand({ping:1})"   # → { ok: 1 }

# Stop
mongosh --eval "db.adminCommand({shutdown:1})"
```

> **Note:** Data directory is at `~/.local/share/mongodb/data`. Logs at
> `~/.local/share/mongodb/log/mongod.log`.

### Verifying both are up

```bash
redis-cli ping && mongosh --quiet --eval "db.runCommand({ping:1})"
```

Expected: `PONG` then `{ ok: 1 }`.

---

## Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/)
- [MongoDB 7+](https://www.mongodb.com/) — running on localhost:27017
- [Redis 5+](https://redis.io/) — running on localhost:6379
- [CRM API](../api-crm/) — running on https://localhost:5005 (for live customer data)
- Groq API key (for LLM-powered ticket analysis — features degrade gracefully without it)

### Setup

```bash
cd apps/api-ai-analytics
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Or from monorepo root:

```bash
pnpm setup:ai
```

### Configure

Copy and populate the local env file:

```bash
cp .env.example .env.local
```

See comments in `.env.local` for where to get each value.

### Run

**Full startup sequence (all dependencies):**

```bash
# 1. Start databases
brew services start redis
mongod --dbpath ~/.local/share/mongodb/data \
       --logpath ~/.local/share/mongodb/log/mongod.log \
       --fork --port 27017

# 2. Start AI-Analytics service
cd apps/api-ai-analytics
source .venv/bin/activate
uvicorn app.main:app --reload --port 4005
```

Or from monorepo root (assumes databases are already running):

```bash
pnpm dev:ai
```

You should see:

```
INFO:     Connecting to MongoDB at mongodb://localhost:27017
INFO:     MongoDB connected
INFO:     Connecting to Redis at redis://localhost:6379/0
INFO:     Redis connected
INFO:     Uvicorn running on http://0.0.0.0:4005
```

### Test

Tests run with mocked infrastructure — no databases or Groq API needed:

```bash
cd apps/api-ai-analytics
source .venv/bin/activate
python -m pytest tests/ -v
```

Or from monorepo root:

```bash
pnpm test:ai
```

---

## Configuration

| Variable | Description | Default |
|----------|-------------|---------| 
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGO_DATABASE` | Database name | `sentracx_analytics` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `CRM_API_BASE_URL` | CRM API base URL | `https://localhost:5005` |
| `CRM_SERVICE_TOKEN` | Service-to-service auth token (optional for now) | — |
| `GROQ_API_KEY` | Groq API key for LLM inference | — |
| `APP_ENV` | Environment (development/production) | `development` |
| `APP_PORT` | Server port | `4005` |
| `APP_HOST` | Bind address | `0.0.0.0` |
| `JWT_SECRET` | JWT verification secret | `dev-secret` |
| `JWT_ISSUER` | JWT issuer URL | `https://localhost:5001/` |

Config is loaded from `.env` and `.env.local` (both gitignored). See `.env.local` for
annotated comments explaining where each value comes from.

---

## API Documentation

When running, interactive API reference is available at:

- **Scalar API Docs**: http://localhost:4005/docs
- **OpenAPI JSON**: http://localhost:4005/openapi.json

Full API documentation: [docs/api/api-ai-analytics.md](../../docs/api/api-ai-analytics.md)

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/customers/{customer_id}/insights` | Customer insights (churn, CLV, NBA) |
| GET | `/api/v1/tickets/{ticket_id}/analysis` | Ticket analysis (sentiment, category, urgency) |

---

## Project Structure

```
api-ai-analytics/
├── app/
│   ├── main.py                        → FastAPI app + lifespan (DB connections)
│   ├── api/v1/
│   │   ├── deps.py                    → Dependency injection wiring
│   │   └── routes/
│   │       ├── customers.py           → Customer insights endpoints
│   │       └── tickets.py             → Ticket analysis endpoints
│   ├── core/
│   │   └── config.py                  → Pydantic Settings (env vars)
│   ├── db/
│   │   ├── mongo.py                   → MongoDB async client lifecycle
│   │   └── redis.py                   → Redis async client lifecycle
│   ├── lib/
│   │   ├── crm_client.py              → Async httpx client for CRM API
│   │   └── groq_client.py             → Groq API client (LLM inference)
│   ├── ml/
│   │   ├── churn_model.py             → Churn risk scoring (0.0–1.0)
│   │   ├── clv_model.py               → Customer Lifetime Value prediction
│   │   ├── nba_model.py               → Next-Best-Action recommendation
│   │   └── ticket_analyzer.py         → Sentiment, category, urgency (Groq + heuristics)
│   ├── repositories/
│   │   ├── mongo/
│   │   │   ├── conversation_transcript_repository.py
│   │   │   └── customer_feature_repository.py
│   │   ├── redis/
│   │   │   ├── customer_cache_repository.py
│   │   │   └── ticket_sentiment_repository.py
│   │   └── vector/                    → Reserved for future pgvector implementation
│   ├── services/
│   │   ├── customer_insights_service.py
│   │   └── ticket_analysis_service.py
│   ├── schemas/                       → Pydantic request/response schemas
│   ├── models/                        → Internal data models (Mongo document shapes)
│   ├── mappers/                       → Schema ↔ model mapping
│   ├── helpers/                       → Utility functions
│   └── exceptions/                    → Custom exceptions
├── tests/                             → Mirrors app/ structure 1:1
│   ├── api/v1/
│   ├── lib/
│   ├── ml/
│   ├── repositories/mongo/
│   ├── repositories/redis/
│   ├── schemas/
│   └── services/
├── pyproject.toml                     → Dependencies + pytest config
├── .env.example                       → Env var documentation
└── .env.local                         → Local config (gitignored)
```

---

## Port

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4005 |
