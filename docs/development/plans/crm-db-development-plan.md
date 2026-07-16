# CRM Development & Database Rollout Plan

This document breaks down the development of the SentraCX CRM system and its data model (`crm-data-model.md`) into logical, manageable phases. By following this sequence, we ensure foundational dependencies (like Identity and Auth) are established before building complex features (like Real-Time Chat or Campaign Scheduling).

---

## Phase 1: Core Identity & Customer Profiles (The Foundation)
**Goal:** Establish the database connection, handle Central Auth synchronization, and build the foundational user views.

**Database / Schema Actions:**
- [x] Initialize PostgreSQL database and ORM/Migration tools.
- [x] Create `User` table.
- [x] Create `CustomerProfile` table with one-to-one FK to `User`.

**System / Backend Actions:**
- [x] Implement JWT validation middleware that parses claims from the `internal-auth-service`.
- [x] Implement the **JIT (Just-In-Time) Provisioning** logic: when a user logs in, ensure their `firstName`, `lastName`, and `employeeNumber` are synced to the local `User` table.
- [x] Build basic REST API endpoints:
    - [x] `GET /api/customers` (List customers)
    - [x] `GET /api/customers/{id}` (Customer details)
    - [x] `PUT /api/customers/{id}/status` (Update CRM status)

---

## Phase 2: External Data Integration (Order History)
**Goal:** Enable the CRM to display external context (eCommerce orders) so staff have a complete view of the customer before ticketing begins.

**Database / Schema Actions:**
- [x] Create `OrderHistory` table with FK to `User/CustomerProfile`.

**System / Backend Actions:**
- [x] Set up a Webhook endpoint or Message Queue (e.g., RabbitMQ) consumer to listen for eCommerce `OrderCreated` and `OrderUpdated` events.
- [x] Implement the ingestion logic to write these events into the `OrderHistory` table.
- [x] Build REST API endpoints:
    - [x] `GET /api/customers/{id}/orders` (View history)

---

## Phase 3: Ticketing System (Core Support Workflow)
**Goal:** Allow customers to raise issues and allow staff to claim and manage them.

**Database / Schema Actions:**
- [ ] Create `Ticket` table with FKs to `User` (creator) and `User` (assignee).
- [ ] Enforce the DB-level status enum (`Unclaimed`, `Claimed`, `Ongoing`, `Completed`, `Canceled`).

**System / Backend Actions:**
- [ ] Build REST API endpoints:
    - [ ] `POST /api/tickets` (Customer creates ticket)
    - [ ] `GET /api/tickets` (List tickets, with filters for status/assignee)
    - [ ] `PUT /api/tickets/{id}/claim` (Staff assigns ticket to self)
- [ ] Implement the presentation logic mapping DB state to UI tabs (e.g., mapping `Unclaimed` + `Claimed` to the "Pending" tab for customers).

---

## Phase 4: Real-Time Chat (WebSockets & Redis Transport)
**Goal:** Enable real-time, bi-directional communication inside active tickets.

**Database / Schema Actions:**
- [ ] Create `Message` table with FKs to `Ticket` and `User` (sender).

**System / Backend Actions:**
- [ ] **Infrastructure:** Spin up Redis and connect the CRM backend to it.
- [ ] **WebSocket Server:** Initialize the WebSocket gateway.
- [ ] **Redis Implementation:**
    - [ ] Implement Connection Registry (`HSET ws:connections:{userId}`).
    - [ ] Implement Presence tracking (`SADD presence:staff:online`).
    - [ ] Implement Pub/Sub fan-out for the `ticket:{ticketId}:messages` channel.
    - [ ] Implement Unread Counters (`HINCRBY unread:{userId}`).
- [ ] **Dual-Write Flow:** Ensure the `sendMessage` action first commits to PostgreSQL (`Message` table), verifies success, and then publishes the payload to Redis.

---

## Phase 5: Marketing & Campaign Orchestration
**Goal:** Allow staff to broadcast messages and track interactions.

**Database / Schema Actions:**
- [ ] Create `Campaign` table.
- [ ] Create `CampaignSchedule` table (One-to-One with Campaign).
- [ ] Create `MarketingInteraction` table (tracking both automated campaign sends and manual outreach).

**System / Backend Actions:**
- [ ] Build REST API endpoints:
    - [ ] `POST /api/campaigns` (Create draft)
    - [ ] `POST /api/interactions` (Log manual outreach touchpoint)
- [ ] **Cron / Task Runner:** Implement a background worker that runs periodically (e.g., every minute) to query `CampaignSchedule` for `nextRunAt <= NOW()`.
- [ ] Implement the batch processing logic that generates `MarketingInteraction` records when a scheduled campaign executes.
