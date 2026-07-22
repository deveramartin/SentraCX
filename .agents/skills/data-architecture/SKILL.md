---
name: data-architecture
description: Polyglot persistence rules — which data goes in PostgreSQL, MongoDB, Redis, or the future vector store. Load when adding a new table/collection/cache key or choosing where new data should live.
category: Architecture
---

## Objective
Govern datastore selections across SentraCX services using clear access-pattern rules and prevent unauthorized or improper data storage addition.

## Instructions
1. Apply datastore rules based on data lifecycle and access pattern:
   - **CRM (PostgreSQL — Source of Truth)**:
     - Owns: User (mirrored from Auth), CustomerProfile, Campaign, CampaignSchedule, MarketingInteraction, Ticket, Message, OrderHistory (synced, read-only).
     - Relational and transactional. Single source of truth for customer, ticket, and order state. AI-Analytics never writes here.
     - EF Core manages all schema changes via migrations. Never hand-edit the DB or write raw SQL against production schema. See `docs/architecture/crm-data-model.md`.
   - **CRM (Redis — Real-Time Transport, NOT Persistence)**:
     - Purpose: SignalR/WebSocket message fan-out across instances, staff presence, unread counters, connection registry, typing indicators.
     - Rule: Every chat message is written to PostgreSQL AND published to Redis. Never Redis-only.
     - Key patterns: `ticket:{ticketId}:messages` (pub/sub), `presence:staff:online` (Set), `unread:{userId}` (Hash), `ws:connections:{userId}` (Hash), `typing:{ticketId}:{userId}` (String, short TTL).
   - **AI-Analytics (MongoDB)**:
     - Purpose: Flexible/semi-structured data — raw conversation transcripts, customer feature log snapshots for ML training, campaign content variations.
     - Collections: `CustomerFeatureLogs`, `CampaignVariations`, `ConversationTranscripts`.
     - Do not put relational/transactional CRM data here.
   - **AI-Analytics (Redis — Inference Cache)**:
     - Purpose: Caching expensive ML inference results (churn score, CLV, next-best-action, ticket analysis) with TTL-based auto-expiry.
     - Key patterns: `customer:{id}:churn_score`, `customer:{id}:next_action`, `ticket:{id}:sentiment_stream` (Sorted Set), `ticket:{id}:analysis`.
     - Separate design justification from CRM's Redis usage (computation cache vs. real-time transport).
   - **AI-Analytics (Vector Store — Planned)**:
     - Purpose: Embeddings for Natural Language Query, semantic search over tickets/conversations, Smart Reply / Intent Detection matching.
     - Planned technology: `pgvector` on a dedicated PostgreSQL instance.
     - Every vector must carry metadata (source id, module, customer id, timestamp) for filtering. `repositories/vector/` is reserved for this.

2. Follow the core decision rule:
   - Transactional/relational → PostgreSQL
   - Flexible document-shaped ML input → MongoDB
   - Ephemeral/low-latency/computed → Redis
   - Embedding/similarity search → vector store (future)
   - Unclear fit → Flag the gap, do not guess.

3. Keep Redis strictly non-durable:
   - Never use Redis as a single source of truth for durable data (chat messages, non-recomputable scores).

## Validation Checklist
* [ ] Datastore choice aligns with the core decision rules.
* [ ] Chat messages persist to PostgreSQL before publishing to Redis.
* [ ] Redis is not used as the sole durable store for critical business data.
* [ ] Database migrations are generated via EF Core for PostgreSQL changes.
