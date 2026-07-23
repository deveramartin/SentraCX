# SentraCX — `api-ai-analytics` Enhanced Backlog

**Stack:** Python (FastAPI) · MongoDB (primary store) · Redis (cache / pub-sub / rate-limit state)
**Note — polyglot architecture:** `api-crm` and `api-oos` are .NET Web API + relational DB (SQL Server/PostgreSQL). `api-ai-analytics` is a separate Python service with its own document store. All cross-service communication is over HTTP/REST or a message broker — never shared DB access.

This backlog goes one layer deeper than the feature list: it defines **where the data comes from, how it's transformed and stored, what the service exposes, how it behaves when uncertain, and who controls its thresholds.** This is the prerequisite for the integration backlog.

Priority: P0 = MVP-critical, P1 = important, P2 = nice-to-have.

---

## EPIC A: Data Ingestion & Storage Strategy (P0)

**A.1 Decide ingestion pattern**

- [x] Decide per data source: event-driven (message broker) vs. scheduled batch sync vs. on-demand API pull
- [x] Recommendation to evaluate: scheduled batch sync (nightly) for heavy historical data (orders, purchase history from `api-oos`), event-driven via broker for near-real-time needs (ticket/conversation sentiment)
- [x] Decide message broker if event-driven is chosen (Redis Streams/Pub-Sub — already in stack — vs. adding RabbitMQ/Kafka/Azure Service Bus). Redis Pub/Sub recommended for MVP since it's already a dependency; revisit if durability/replay guarantees become necessary
- [x] Document decision + rationale in `/docs/ai/ingestion-strategy.md`

**A.2 Relational → document transform (ETL)**

- [x] Backend: Since `api-oos`/`api-crm` are relational (.NET/SQL) and `api-ai-analytics` is MongoDB, define an explicit transform step — no 1:1 table-to-collection copy
- [x] Backend: Design MongoDB collection schemas (e.g., `customers`, `orders`, `tickets`, `conversations`, `ai_scores`) — denormalized/embedded where it suits read patterns, since Mongo isn't relational
- [x] Backend: Build `OrderIngestionService` (Python) — pulls/receives `OrderSyncDto` payloads (JSON over REST or from broker) and writes transformed documents to MongoDB
- [x] Backend: Same pattern for ticket/conversation ingestion from `api-crm`
- [x] Backend: Use Pydantic models for validating/transforming incoming DTOs before persistence

**A.3 Order/purchase data from `api-oos`** 🔗

- [x] Backend: Define read contract — `api-ai-analytics` calls `api-oos`'s internal REST endpoint, or `api-oos` publishes events it subscribes to
- [x] Backend: Define minimum fields needed: order id, customer id, order date, total, status, line items, cancellation flag
- [x] Backend: Sync job (Python — APScheduler, Celery beat, or a scheduled Azure/cron function) with retry + failure logging
- [x] Backend: Store transformed data in MongoDB — do not query `api-oos` live for every score calculation
- [x] Backend: Define sync cadence (e.g., nightly for CLV/segmentation, more frequent for anomaly detection)

**A.4 Ticket/conversation data from `api-crm`** 🔗

- [x] Backend: Define read contract — internal REST call to `api-crm` vs. event stream (no shared DB access, since `api-crm` is SQL-based and separate)
- [x] Backend: Define minimum fields needed: ticket id, customer id, category, status, timestamps, message text
- [x] Backend: Build ingestion consumer for ticket/conversation events
- [x] Backend: Real-time features (sentiment analysis, real-time tracking, smart replies) must be synchronous/event-driven, not batch — define latency SLA (e.g., under 2s), likely backed by Redis for low-latency state

**A.5 Data freshness & staleness handling**

- [x] Backend: Each AI output document includes a `computed_at` timestamp
- [x] Backend: Define max staleness per feature (e.g., churn score OK if <24h old; real-time sentiment must be <5s old)
- [ ] Frontend (`web-crm`): Show "last updated" indicator next to AI-derived values

**A.6 Redis usage strategy**

- [x] Backend: Cache hot AI outputs (churn score, CLV, segment) in Redis with TTL matching the staleness policy (A.5) — avoids re-querying MongoDB/re-running inference on every `api-crm`/`web-crm` request
- [x] Backend: Use Redis for rate-limiting/circuit-breaker state on cross-service calls (shared with Epic Q of the integration backlog)
- [x] Backend: Use Redis for short-TTL chatbot session/conversation state (Epic 5.11 features)
- [x] Backend: Use Redis Pub/Sub (or Streams if replay is needed) for real-time sentiment/escalation events if event-driven ingestion (A.1) is chosen
- [x] Backend: Document cache invalidation strategy — when does a fresh score computation bust the Redis cache

---

## EPIC B: API Contracts Exposed by `api-ai-analytics` (P0)

FastAPI auto-generates the OpenAPI/Swagger spec from route + Pydantic model definitions — this becomes the source of truth for contract generation (see Epic P of the integration backlog).

**B.1 Customer Profile endpoints**

- [x] `GET /api/ai/customers/{customer_id}/segment` → `{ segment, computed_at, confidence }`
- [x] `GET /api/ai/customers/{customer_id}/churn-score` → `{ score, risk_level, contributing_factors[], computed_at }`
- [x] `GET /api/ai/customers/{customer_id}/clv` → `{ predicted_clv, currency, computed_at }`
- [x] `GET /api/ai/customers/{customer_id}/next-action` → `{ action, reason, confidence, computed_at }`
- [x] `POST /api/ai/customers/{customer_id}/next-action/feedback` → log accept/dismiss/complete for model tuning

**B.2 Ticket endpoints**

- [x] `POST /api/ai/tickets/analyze` → input: ticket text/id; output: `{ sentiment, category, priority_score, confidence }` (called synchronously by `api-crm` on ticket creation)
- [x] `GET /api/ai/tickets/{ticket_id}/resolution-estimate` → `{ estimated_hours, confidence }`
- [x] `GET /api/ai/tickets/volume-forecast?range=` → `{ forecast_series[], threshold, alert_triggered }`

**B.3 Conversation endpoints**

- [x] `POST /api/ai/conversations/{id}/analyze-message` → real-time sentiment + escalation flag (called per message by `api-crm`'s SignalR hub)
- [x] `GET /api/ai/conversations/{id}/summary` → on-demand + Redis-cached summary, regenerate flag
- [x] `POST /api/ai/conversations/{id}/suggest-replies` → suggestion list
- [x] `POST /api/ai/conversations/{id}/detect-intent` → intent label + confidence
- [x] `GET /api/ai/conversations/{id}/entities` → extracted entities, 🔗 order numbers cross-referenced to `api-oos`

**B.4 Dashboard/aggregate endpoints**

- [x] `GET /api/ai/dashboard/summary?from=&to=` → combined churn/sentiment/campaign/ticket metrics (MongoDB aggregation pipeline)
- [x] `GET /api/ai/anomalies?from=&to=&status=` → anomaly list with severity
- [x] `POST /api/ai/query` → natural-language query → structured result

**B.5 Contract documentation**

- [x] Backend: Publish FastAPI's auto-generated OpenAPI spec at a stable path (`/openapi.json`)
- [ ] Backend: 🔗 Generate shared TypeScript types for `web-crm` from the FastAPI OpenAPI spec (same tooling as `br-online-shop`'s `openapi-typescript` approach)
- [ ] Backend: Version the API (e.g., `/api/ai/v1/...`) so `api-crm`/`web-crm` aren't broken by model iteration

---

## EPIC C: Confidence, Fallback & Degradation (P0)

- [ ] Backend: Every scoring/classification response includes a `confidence` value (0–1)
- [ ] Backend: Define per-feature confidence threshold below which output is withheld or marked "Unclassified"/"Uncategorized"
- [ ] Backend: Ticket auto-categorization falls back to "Uncategorized" + manual tagging when confidence is low
- [ ] Backend: Sentiment falls back to "Neutral/Unclassified" (not silently guessing) when confidence is low
- [ ] Backend: Define behavior when `api-ai-analytics` is down/unreachable — `api-crm`/`web-crm` (both .NET/JS clients) must degrade gracefully (e.g., ticket creation still succeeds without AI tagging)
- [ ] Backend: Circuit breaker + timeout policy on all `api-ai-analytics` calls made by `api-crm` (e.g., Polly in .NET for the caller side), backed by Redis-stored breaker state on the `api-ai-analytics` side for coordinated status
- [ ] Frontend: UI clearly distinguishes AI-suggested values from confirmed/manual values, and shows an "AI unavailable" state instead of blank/broken UI

---

## EPIC D: Admin Configuration (P1)

- [ ] Backend: `GET/PUT /api/ai/config/churn-threshold`
- [ ] Backend: `GET/PUT /api/ai/config/priority-weights`
- [ ] Backend: `GET/PUT /api/ai/config/anomaly-sensitivity`
- [ ] Backend: `GET/PUT /api/ai/config/confidence-thresholds`
- [ ] Backend: Config stored in MongoDB `config` collection, hot-read copy cached in Redis for low-latency access during scoring
- [ ] Backend: Config changes audit-logged (who changed what, when)
- [ ] Frontend (`web-crm`): Admin settings page — thresholds/weights, restricted to manager/admin roles

---

## EPIC E: Model Lifecycle & Data Governance (P1)

- [ ] Backend: Model versioning scheme (e.g., semantic version per model, stored with each prediction document for traceability)
- [ ] Backend: Retraining cadence defined per model (e.g., churn/CLV monthly, sentiment as-needed)
- [ ] Backend: PII handling policy — churn score, CLV, and segmentation are sensitive; define role-based access, and whether raw PII is sent to any external LLM provider
- [ ] Backend: If using a third-party LLM API (content suggestions, NL query, summarization) — define redaction/anonymization before sending customer text externally
- [ ] Backend: MongoDB TTL indexes or scheduled cleanup for data retention policy on analyzed conversation/ticket text
- [ ] Docs: Document model inputs/outputs per feature for audit purposes

---

## EPIC F: Feature Backlog (carried over, now dependent on A–E)

> Original feature stories from `sentracx-crm-backlog-improved.md` Epics 4–7. Each should reference:
- [ ] The specific `api-ai-analytics` endpoint from Epic B it implements
- [ ] The confidence/fallback behavior from Epic C
- [ ] Any admin-configurable value from Epic D it uses
- [ ] Whether it reads hot from Redis cache or MongoDB directly

---

## Suggested Build Order

| Phase | Focus |
|---|---|
| 1 | Epic A (ingestion strategy, ETL transform, MongoDB schema, Redis usage plan) |
| 2 | Epic B (API contracts) + Epic C (confidence/fallback) — built together per feature |
| 3 | Epic D (admin config) |
| 4 | Epic F feature implementation against stable contracts |
| 5 | Epic E (governance/model lifecycle) — parallel track, needed before production |
| 6 | Dashboard (Epic 7 in CRM backlog) — consumes B.4 aggregate endpoints |

---
