# api-ai-analytics

SentraCX AI & Analytics Service — FastAPI with Pydantic and MongoDB.

## Tech Stack

- **FastAPI** — Async Python web framework
- **Pydantic v2** — Data validation and serialization
- **Motor** — Async MongoDB driver
- **MongoDB** — Document database for analytics data
- **Uvicorn** — ASGI server

## Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/)
- [MongoDB 7+](https://www.mongodb.com/)

### Setup (from monorepo root)

```bash
pnpm setup:ai
```

This creates a `.venv` and installs all dependencies.

### Run (from monorepo root)

```bash
pnpm dev:ai
```

### Run (standalone)

```bash
cd apps/api-ai-analytics
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 4005
```

### Test

```bash
pnpm test:ai
# or
cd apps/api-ai-analytics && .venv/bin/pytest
```

## Configuration

Copy the example env file:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGO_DATABASE` | Database name | `sentracx_analytics` |
| `APP_ENV` | Environment (development/production) | `development` |
| `APP_PORT` | Server port | `4005` |
| `JWT_SECRET` | JWT verification secret | — |
| `JWT_ISSUER` | JWT issuer URL | — |
| `OPENAI_API_KEY` | OpenAI API key (optional) | — |

## API Documentation

When running, interactive docs are available at:

- **Swagger UI**: http://localhost:4005/docs
- **ReDoc**: http://localhost:4005/redoc
- **OpenAPI spec**: http://localhost:4005/openapi.json

## Project Structure

```
api-ai-analytics/
├── app/
│   ├── main.py           # FastAPI app entrypoint
│   ├── api/
│   │   └── v1/
│   │       ├── routes/   # API route handlers
│   │       └── deps.py   # Dependency injection
│   ├── core/             # Config, settings
│   ├── models/           # Pydantic models / Mongo document schemas
│   ├── schemas/          # Request/response schemas
│   ├── services/         # Business logic
│   ├── mappers/          # Document <-> schema mapping
│   ├── helpers/          # Utility functions
│   ├── db/               # MongoDB client/session
│   └── exceptions/       # Custom exceptions
├── tests/                # pytest tests
├── pyproject.toml        # Project metadata & dependencies
├── requirements.txt      # Pip requirements
└── Dockerfile
```

## Docker

```bash
docker build -t sentracx-api-ai-analytics .
docker run -p 4005:4005 sentracx-api-ai-analytics
```

## Port

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4005 |
| Docker      | http://localhost:4005 |

## Adding Dependencies

```bash
cd apps/api-ai-analytics
source .venv/bin/activate
pip install <package>
pip freeze > requirements.txt
```

Or update `pyproject.toml` and re-run `pnpm setup:ai`.
