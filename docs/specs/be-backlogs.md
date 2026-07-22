# CRM Product Backlog — Backend

Each item maps to its BRD requirement(s) where applicable, so tasks can be traced back to BR/FR IDs.

---

## Sprint 1

### CRM-001 — Customer Profiles (Contacts & Leads)
*Maps to: BR-CRM-01*

- [x] Design `customer` data model: type (contact/lead), first name, last name, email, phone (optional), customer type (vip, regular, institutional buyer, lead), status (active/inactive/suspended), address (optional), profile (optional), notes (optional), created_at
- [x] CRUD endpoints for customer contact and customer lead records
- [x] Endpoint to update customer status (active, inactive, suspended)
- [x] Endpoint to update customer type — enforce that a lead's type is always fixed to `"lead"` and cannot be changed to vip/regular/institutional buyer until converted
- [x] Endpoint to delete a customer contact/lead
- [x] Endpoint to add/update notes on a customer profile
- [x] Endpoint returning customer overview (name, email, address, created_at, status, type, profile, top 5 most recent order history items, top 5 most recent marketing history items)
- [x] Paginated endpoint for a customer's marketing history (title, description, channel, interaction type, sent_at)
- [x] Paginated endpoint for a customer's order history — restrict to customer contacts (ecommerce users) only; leads should not have this data/endpoint accessible
- [x] Webhook/integration: auto-create a customer **contact** record on ecommerce website signup
- [x] Webhook/integration: auto-create a customer **lead** record when any lead-gen form is submitted
- [ ] ~~Endpoint to support "email button" redirect to campaign~~ — marked **Discarded**, confirm before building

---

## Sprint 2

### CRM-002 — Campaigns
*Maps to: BR-CRM-05, BR-CRM-06*

- [x] Design `campaign` data model: title, subject, description, channels (email, in-app, facebook, twitter, instagram), schedule type (send now, scheduled, recurring), recurring days (mon/tue/wed), images (optional), template reference, status (draft, active, ended)
- [x] CRUD endpoints for campaigns
- [x] Endpoints to list campaigns filtered by status: active (campaign list tab), draft, history (ended)
- [x] Endpoint to fetch single campaign details
- [x] Scheduling logic to send campaigns immediately, on a schedule, or recurring on specified weekdays
- [x] Background job to auto-stop a campaign once its end date/schedule has elapsed
- [x] Draft save/update logic (partial campaign data allowed while in draft state)
- [x] Template storage and retrieval endpoints
- [x] Endpoint to record which marketing channel(s) were used per campaign (FR-CRM-06.2)

### CRM-003 — Promotions
*Maps to: BR-CRM-05*

- [x] Design `promotion` data model: title, description, promotion type (discount, voucher, free shipping, buy-one-get-one, cashback), discount value, voucher code, start date, end date, status (draft, active, cancelled, accomplished)
- [x] CRUD endpoints for promotions
- [x] Endpoints to list promotions by status: all/active, drafted, cancelled, accomplished
- [x] Endpoint to fetch single promotion details
- [x] Endpoint to draft a promotion (partial/incomplete data allowed)
- [x] Endpoint to edit/update a drafted promotion
- [x] Endpoint to stop/cancel an active promotion
- [x] Background job or logic to auto-mark a promotion as "accomplished" once its end date passes
- [x] Field validation per promotion type (e.g., discount value required for discount type, voucher code required for voucher type)

### CRM-004 — Campaign–Promotion Linking
- [x] Many-to-many relationship between `campaign` and `promotion`
- [x] Endpoint to attach/select multiple promotions under a single campaign

### CRM-005 — Tickets (Staff/Manager view)
*Maps to: BR-CRM-02*

- [x] Design `ticket` data model: title, description, image (optional), status (unclaimed/available, claimed, completed, cancelled), assigned_to (user), created_by (customer), timestamps
- [x] Endpoint to list unclaimed/available tickets
- [x] Endpoint to list tickets claimed by the current staff user
- [x] Endpoint to list completed tickets assigned to the current staff user
- [x] Endpoint to fetch ticket details
- [x] Endpoint to claim a ticket (assign to current user)
- [x] Endpoint to unclaim a ticket (unassign)
- [x] Link ticket to its associated conversation thread for the "message" redirect

### CRM-006 — Tickets (Customer view)
*Maps to: BR-CRM-02*

- [x] Endpoint to create a ticket (title, description, image optional) — status defaults to pending
- [x] Endpoints to list tickets by status for the requesting customer: pending, ongoing, completed, cancelled
- [x] Endpoint to fetch ticket details
- [x] Endpoint to cancel a ticket
- [x] Image upload/storage handling for ticket attachments
- [x] Timestamp/audit logging on ticket submissions per NFR-CRM-02.4

---

## Sprint 3

### CRM-007 — Conversations (Staff/Manager view)
*Maps to: BR-CRM-03, BR-CRM-04*

- [ ] Real-time messaging infrastructure (e.g., WebSocket/pub-sub channel per conversation)
- [x] Design `conversation` and `message` data models, linked to the originating ticket
- [x] Endpoint/socket event to send a message
- [ ] Endpoint/socket event to receive/stream messages in real time
- [x] Endpoint to list active conversations for a user (sourced from claimed tickets)
- [x] Endpoints to list conversations filtered by unread / read / all
- [x] Endpoint to mark a message/conversation as read or unread
- [x] Endpoint to fetch message/conversation details
- [x] Endpoint to mark the linked ticket as completed or unclaim it from within the conversation
- [x] Persist conversation history for a minimum of 1 year (NFR-CRM-03.3), restrict access to authorized participants only (NFR-CRM-03.2)

### CRM-008 — Conversations (Customer view)
*Maps to: BR-CRM-03, BR-CRM-04*

- [ ] Reuse real-time messaging infrastructure from CRM-007 for customer-to-staff chat
- [ ] Chatbot integration: route incoming customer messages to an agent bot first
- [ ] Logic to detect when the bot's response is insufficient and prompt escalation to a live agent
- [ ] Escalation endpoint to hand off a conversation from bot to human staff
- [x] Endpoint to cancel the linked ticket from within the conversation view
- [x] Endpoint to fetch message details

---

## Sprint — Feedback & Ratings

### CRM-009 — Feedback & Ratings
*Maps to: BR-CRM-07*

- [ ] Design `feedback` data model: customer_id, product_id, rating (1–5), feedback text (max 500 chars), created_at
- [ ] Endpoint to submit feedback/rating for a product — validate max 500 characters and rating range 1–5 server-side
- [ ] Endpoint to fetch all feedback + computed average rating for a product
- [ ] Endpoint(s) to support admin/marketing feedback analysis views (FR-CRM-07.3, FR-CRM-07.4)

---

## Cross-Cutting (Role-Based Access Control)
*Maps to: BR-CRM-08 — not yet scheduled in a sprint per source material; recommend adding to backlog*

- [ ] Design role model: Admin, CEO, Manager, Support, Marketing
- [ ] Middleware/guard to enforce role-based permissions on every endpoint across all modules
- [ ] Admin endpoints to assign/manage user roles
- [ ] Data encryption in transit and at rest for customer data (NFR-CRM-01.2)