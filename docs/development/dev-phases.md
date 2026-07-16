# SentraCX System Development Phases

This document outlines the high-level, end-to-end development roadmap for the SentraCX system. It synthesizes the development of the CRM (.NET), the AI-Analytics Microservice (Python), and the Frontend (Next.js) into a cohesive, phased approach to ensure dependencies are built in the correct order.

---

## Phase 1: Foundation & CRM Backend Basics
**Goal:** Establish the core CRM backend, connect it to the Central Auth service, and build the foundational data models.

**Tasks:**
- [ ] Initialize the `.NET` CRM backend repository.
- [ ] Configure PostgreSQL and run initial Entity Framework migrations for `User` and `CustomerProfile`.
- [ ] Implement JWT validation to authenticate against the Central Auth Service (`internal-auth-service`).
- [ ] Implement Just-In-Time (JIT) provisioning to mirror Auth details into the local CRM `User` table.
- [ ] Build basic CRUD REST API endpoints for Customer Management.
- [ ] Set up the webhook/event consumer to ingest eCommerce orders into `OrderHistory`.

---

## Phase 2: Ticketing & Frontend Scaffold
**Goal:** Build the core ticketing workflow on the backend and start scaffolding the Next.js frontend to consume these APIs.

**Tasks:**
- [ ] Initialize the `Next.js` frontend repository with TailwindCSS and `shadcn/ui`.
- [ ] Build the CRM backend APIs for `Ticket` management (Create, Claim, Update Status).
- [ ] Enforce the strict Ticket state machine (`Unclaimed`, `Claimed`, `Ongoing`, `Completed`, `Canceled`) in the backend.
- [ ] Develop the Frontend Customer Portal: View Order History and submit/view Pending Tickets.
- [ ] Develop the Frontend Staff Dashboard: View Customer lists and manage/claim Unclaimed Tickets.

---

## Phase 3: Real-Time Chat Integration
**Goal:** Enable bi-directional WebSocket chat for active tickets, backed by Redis for multi-instance horizontal scaling.

**Tasks:**
- [ ] Provision the **CRM Redis** instance (used strictly for transport, not ML cache).
- [ ] Implement WebSocket server gateway in the `.NET` CRM backend.
- [ ] Build the Redis Pub/Sub broadcast logic (`ticket:{ticketId}:messages`) and the dual-write flow to PostgreSQL.
- [ ] Implement Redis state trackers: Connection Registry, Staff Presence, and Unread Counters.
- [ ] Build the real-time Chat UI component in the Next.js frontend (handling socket connections, typing indicators, and message rendering).

---

## Phase 4: AI-Analytics Scaffold & Event Pipeline
**Goal:** Stand up the Python microservice and establish the data pipeline flowing from the CRM into the analytical databases.

**Tasks:**
- [ ] Initialize the `Python / FastAPI` repository for AI-Analytics.
- [ ] Provision **MongoDB** and define the PyMongo/Motor schemas for `CustomerFeatureLogs` and `ConversationTranscripts`.
- [ ] Configure the Event Bus (RabbitMQ/Kafka) so the CRM can publish events (e.g., `TicketClosed`, `MessageSent`).
- [ ] Build FastAPI consumer workers to ingest these events and store denormalized payloads into MongoDB.

---

## Phase 5: AI Models, Vector Search & Ephemeral Caching
**Goal:** Implement the intelligence layer, semantic search, and the caching mechanisms to serve predictions quickly.

**Tasks:**
- [ ] Provision the dedicated PostgreSQL instance for `pgvector`.
- [ ] Build the LLM embedding pipeline: convert ticket texts into 1536-dimensional vectors and store them in `pgvector`.
- [ ] Provision the **AI-Analytics Redis** instance.
- [ ] Develop background batch jobs in Python to calculate ML scores (Churn, CLV, Next-Best-Action) from MongoDB data.
- [ ] Cache these computed scores into Redis with TTLs (e.g., 24 hours).
- [ ] Build the streaming sentiment analyzer to push real-time conversation sentiment into Redis Sorted Sets.

---

## Phase 6: Unified Analytics & Advanced UI Integration
**Goal:** Expose the AI insights back to the CRMS via API and build the unified management dashboards in the frontend.

**Tasks:**
- [ ] Build FastAPI REST endpoints to expose AI predictions (e.g., `GET /api/v1/customers/{id}/insights`).
- [ ] Build FastAPI REST endpoints for Natural Language Query (NLQ) leveraging `pgvector`.
- [ ] Update the Next.js Staff Dashboard to display Churn Scores, CLV, and Next-Best-Action badges on customer profiles.
- [ ] Develop the Unified Analytics Dashboard in Next.js (displaying aggregate metrics, campaign ROI, and ticket volume forecasts).
- [ ] Implement Smart Reply Suggestions in the frontend chat component by querying the AI-Analytics intent matching API.
