# AI-Analytics Microservice Development & Database Rollout Plan

This document breaks down the phased implementation of the SentraCX AI-Analytics microservice and its polyglot data architecture (`ai-analytics-data-model.md`). Because this system relies on three distinct databases (MongoDB, Redis, pgvector), rolling them out progressively ensures stability and reduces infrastructure complexity during initial sprints.

---

## Phase 1: Microservice Scaffold & Event Ingestion Pipeline
**Goal:** Establish the separate microservice architecture and wire up the event-driven data flow from the primary CRMS system.

**Infrastructure / Database Actions:**
- [ ] Initialize the new microservice repository (distinct from the main CRM app).
- [ ] Setup RabbitMQ, Kafka, or Webhook listeners to receive events from the CRMS.
- [ ] Provision the **MongoDB** instance (for raw document storage).

**System / Backend Actions:**
- [ ] Define the event contracts (e.g., `TicketClosed`, `OrderPlaced`, `CustomerUpdated`).
- [ ] Build consumer workers to listen for CRMS events.
- [ ] Implement ingestion logic to dump raw, denormalized JSON payloads into MongoDB collections (`CustomerFeatureLogs`, `ConversationTranscripts`).

---

## Phase 2: Vector Store & Embeddings Pipeline (pgvector)
**Goal:** Introduce Semantic Search, Intent Detection, and Natural Language Query capabilities by generating and storing vector embeddings.

**Infrastructure / Database Actions:**
- [ ] Provision a dedicated **PostgreSQL** instance for the AI service.
- [ ] Install and configure the `pgvector` extension.
- [ ] Create the `document_embeddings` table (UUID, string FKs, Vector(1536)).

**System / Backend Actions:**
- [ ] Integrate an LLM Embedding API client (e.g., OpenAI `text-embedding-3-small`).
- [ ] Build the embedding pipeline: When a `TicketClosed` event is processed, send text to the LLM, retrieve the vector array, and `INSERT` into `document_embeddings`.
- [ ] Implement cosine similarity search functions (`ORDER BY embedding <-> query_vector`).

---

## Phase 3: ML Feature Generation & Batch Processing (MongoDB)
**Goal:** Finalize the semi-structured document storage that will feed offline ML training models (like Churn and CLV predictions).

**Infrastructure / Database Actions:**
- [ ] Define indexes in MongoDB to optimize read queries for the batch processors (e.g., indexing on `crms_customer_id`).
- [ ] Create the `CampaignVariations` collection for AI-generated content.

**System / Backend Actions:**
- [ ] Build scheduled batch jobs (e.g., nightly) that aggregate data from `CustomerFeatureLogs`.
- [ ] Integrate ML inference scripts (or external model APIs) to generate scores based on the aggregated MongoDB data.
- [ ] Implement LLM prompts to generate `CampaignVariations` upon receiving campaign creation drafts from the CRMS.

---

## Phase 4: Low-Latency Ephemeral Data (Redis)
**Goal:** Ensure the CRMS can instantly fetch AI predictions without waiting for complex ML calculations, and enable real-time tracking features.

**Infrastructure / Database Actions:**
- [ ] Provision the **Redis** instance for the AI-Analytics service.

**System / Backend Actions:**
- [ ] Modify the batch ML jobs from Phase 3 to `SET` their final predictions (Churn, CLV, Next-Best-Action) into Redis with a 24-hour TTL (`customer:{id}:churn_score`).
- [ ] Implement the **Real-Time Sentiment Tracking**: As active conversation chunks stream in via events, run them through a lightweight sentiment analyzer and push the scores into a Redis Sorted Set (`ticket:{id}:sentiment_stream`).

---

## Phase 5: CRMS Integration & REST API Exposure
**Goal:** Make the computed insights, vectors, and predictions available to the main CRMS presentation layer.

**Infrastructure / Database Actions:**
- [ ] (No new databases; focus is on read-heavy API routing across the 3 existing stores).

**System / Backend Actions:**
- [ ] Build REST API endpoints for the CRMS to consume:
    - [ ] `GET /api/v1/customers/{id}/insights` (Reads sub-millisecond from Redis)
    - [ ] `POST /api/v1/tickets/analyze-intent` (Embeds payload, queries `pgvector` for nearest neighbors)
    - [ ] `GET /api/v1/analytics/dashboard/unified` (Runs aggregation pipelines on MongoDB)
- [ ] Ensure proper API authentication/authorization so only the trusted CRMS backend can query the AI-Analytics service.
