---
name: ai-analytics-fastapi-structure
description: Enforces the FastAPI project structure, strict layering rules, and file-placement conventions for apps/api-ai-analytics. Load when creating or editing any file under that service.
category: Architecture
---

## Objective
Provide standard directory structure layout and strict layering rules for the Python/FastAPI `api-ai-analytics` application to maintain clean architecture and entity/store separation.

## Instructions
1. Follow the standard directory structure for `apps/api-ai-analytics`:
   ```
   apps/api-ai-analytics/
   ├── app/
   │   ├── api/
   │   │   └── v1/
   │   │       ├── deps.py                            → Dependency injection wiring
   │   │       └── routes/
   │   │           ├── customers.py                   → churn, CLV, segmentation, NBA endpoints
   │   │           └── tickets.py                     → sentiment, analysis endpoints
   │   ├── core/
   │   │   └── config.py                              → Pydantic Settings (env vars)
   │   ├── db/
   │   │   ├── mongo.py                               → Motor async client lifecycle ONLY
   │   │   └── redis.py                               → Redis async client lifecycle ONLY
   │   ├── lib/
   │   │   ├── crm_client.py                          → Async httpx client for CRM API
   │   │   └── groq_client.py                         → Groq API client (LLM inference)
   │   ├── ml/
   │   │   ├── churn_model.py                         → Churn risk scoring (0.0–1.0)
   │   │   ├── clv_model.py                           → Customer Lifetime Value prediction
   │   │   ├── nba_model.py                           → Next-Best-Action recommendation
   │   │   └── ticket_analyzer.py                     → Sentiment, category, urgency analysis
   │   ├── repositories/
   │   │   ├── mongo/
   │   │   │   ├── conversation_transcript_repository.py
   │   │   │   └── customer_feature_repository.py
   │   │   ├── redis/
   │   │   │   ├── customer_cache_repository.py
   │   │   │   └── ticket_sentiment_repository.py
   │   │   └── vector/                                → Reserved for future pgvector implementation
   │   ├── services/
   │   │   ├── customer_insights_service.py
   │   │   └── ticket_analysis_service.py
   │   ├── schemas/
   │   │   ├── customer_schemas.py
   │   │   └── ticket_schemas.py
   │   ├── models/                                    → Internal data models (Mongo document shapes)
   │   ├── mappers/                                   → Schema ↔ model mapping only
   │   ├── exceptions/                                → Custom exceptions
   │   ├── helpers/                                   → Utility functions
   │   └── main.py                                    → FastAPI app + lifespan (DB connections)
   ├── tests/                                         → Mirrors app/ structure 1:1
   │   ├── api/v1/
   │   ├── lib/
   │   ├── ml/
   │   ├── repositories/
   │   │   ├── mongo/
   │   │   └── redis/
   │   ├── schemas/
   │   └── services/
   ├── pyproject.toml
   ├── .env.example
   └── .env.local                                     → Local config (gitignored)
   ```

2. Enforce strict layering rules:
   - **Routes**: Request/response handling only. Call `services/`, never call `db/` or `repositories/` directly, never call `ml/` directly.
   - **Services**: Orchestration and business logic. Compose one or more repositories and/or `ml/` inference calls. No FastAPI-specific request/response objects — pure Python in, Pydantic schema or plain object out.
   - **Repositories**: One repository per store + entity. A repository only ever talks to one store. No cross-store logic inside a repository — that belongs in a service.
   - **db/**: Connection/client lifecycle only — no queries live here.
   - **lib/**: External API clients only (`crm_client.py`, `groq_client.py`). No business logic.
   - **ml/**: Model loading and heuristic inference only. No persistence logic, no route logic. Services call into `ml/` when a prediction is needed, then hand the result to a repository to cache/store. Groq API is used for LLM-powered analysis; all ML modules include heuristic fallbacks.
   - **schemas/**: One Pydantic schema file per resource — request and response models can share a file only if they describe the same resource.
   - **models/**: Internal representations (Mongo document shapes), not API-facing.
   - **mappers/**: Schema ↔ model conversion only.
   - **tests/**: Mirrors `app/` 1:1 — `app/services/customer_insights_service.py` requires `tests/services/test_customer_insights_service.py`.
   - New folders are allowed for genuinely new concerns (e.g., a future `tasks/` folder for background jobs) as long as the store-per-repository and route→service→repository layering isn't blurred.

## Validation Checklist
* [ ] All new files placed in the appropriate layer directory.
* [ ] Routes only interact with services, not db, repositories, or ml modules directly.
* [ ] Each repository only queries a single data store.
* [ ] Test files mirror corresponding source files 1:1 under `tests/`.
