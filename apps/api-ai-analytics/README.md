# api-ai-analytics

SentraCX AI & Analytics Service — FastAPI microservice that provides customer insights
(churn scoring, CLV prediction, Next-Best-Action recommendations) by consuming data from
the CRM API.

## Tech Stack

- **FastAPI** — Async Python web framework
- **Pydantic v2 + pydantic-settings** — Data validation and typed config from env vars
- **Motor** — Async MongoDB driver
- **redis.asyncio** — Async Redis client (with hiredis for performance)
- **httpx** — Async HTTP client (calls CRM API)
- **Uvicorn** — ASGI server

## Databases

| Store | Purpose | Default URL |
|-------|---------|-------------|
| **MongoDB** | Feature log snapshots (historical ML input data) | `mongodb://localhost:27017` |
| **Redis** | Cache for computed insights (24h TTL) | `redis://localhost:6379/0` |

Both must be running before the service starts.

### Starting databases

**Redis** (installed via Homebrew):

```bash
# Start (auto-restarts on login)
brew services start redis

# Verify
redis-cli ping   # → PONG

# Stop
brew services stop redis
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
- [CRM API](../api-crm/) — running on localhost:5005 (for live customer data)

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
cp .env.local .env.local   # already exists as a template with comments
```

Or create from scratch:

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

Tests run with mocked infrastructure — no databases needed:

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
| `CRM_API_BASE_URL` | CRM API base URL | `http://localhost:5005` |
| `CRM_SERVICE_TOKEN` | Service-to-service auth token (optional for now) | — |
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

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/customers/{customer_id}/insights` | Customer insights (churn, CLV, NBA) |

---

## Project Structure

```
api-ai-analytics/
├── app/
│   ├── main.py                  # FastAPI app + lifespan (DB connections)
│   ├── api/v1/
│   │   ├── routes/customers.py  # Customer insights route
│   │   └── deps.py              # Dependency injection wiring
│   ├── core/config.py           # Pydantic Settings (env vars)
│   ├── db/
│   │   ├── mongo.py             # MongoDB async client lifecycle
│   │   └── redis.py             # Redis async client lifecycle
│   ├── lib/crm_client.py        # HTTP client for CRM API
│   ├── ml/                      # Heuristic ML models
│   │   ├── churn_model.py       # Churn risk scoring (0.0–1.0)
│   │   ├── clv_model.py         # Customer Lifetime Value prediction
│   │   └── nba_model.py         # Next-Best-Action recommendation
│   ├── schemas/                  # Pydantic request/response schemas
│   ├── services/                 # Business logic orchestration
│   ├── repositories/
│   │   ├── redis/               # Cache repository
│   │   └── mongo/               # Feature log repository
│   ├── models/                   # Internal data models
│   ├── mappers/                  # Schema ↔ model mapping
│   ├── helpers/                  # Utility functions
│   └── exceptions/               # Custom exceptions
├── tests/                        # Mirrors app/ structure 1:1
├── pyproject.toml                # Dependencies + pytest config
├── .env.example                  # Env var documentation
└── .env.local                    # Local config (gitignored)
```

---

## Port

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4005 |
