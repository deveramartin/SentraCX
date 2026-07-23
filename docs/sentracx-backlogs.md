# SentraCX (CRM + AI-Analytics) — Improved Project Backlog

**Stack:** .NET Web API (`api-crm`, `api-ai-analytics`) · Next.js + Tailwind + shadcn/ui (`web-crm`)
**Related repo:** `br-online-shop` (`web-shop`, `web-oos`, `api-oos`) — cross-repo touchpoints are flagged with 🔗

Organized as Epics → User Stories → Tasks (Backend / Frontend split), matching the `br-online-shop` backlog format. Priority: P0 = MVP-critical, P1 = important, P2 = nice-to-have.

This file restructures and tightens the existing CRM + AI-Analytics stories only. Dedicated **integration backlogs** (contracts between `api-crm`, `api-ai-analytics`, and `api-oos`) will be written separately once this is confirmed.

---

## EPIC 1: Ticketing (P0)

**1.1 Internal ticket queue (Employee/Manager/Staff)**

- [ ] Backend: `GET /api/tickets?status=unclaimed` — list available tickets
- [ ] Backend: `GET /api/tickets?status=claimed&userId=` — list tickets claimed by user
- [ ] Backend: `GET /api/tickets?status=completed&userId=` — list completed tickets
- [ ] Backend: `GET /api/tickets/{id}` — ticket detail
- [ ] Backend: `POST /api/tickets/{id}/claim`, `POST /api/tickets/{id}/unclaim`
- [ ] Backend: 🔗 Ticket entity should reference `orderId` / `productId` where applicable, sourced from `br-online-shop` (`api-oos`), for context in ticket detail view
- [ ] Frontend: Tickets tab (Available / Claimed / Completed) using shadcn Tabs
- [ ] Frontend: Ticket card component (claim/unclaim button, status badge)
- [ ] Frontend: Ticket detail view (linked order/product info if present)
- [ ] Frontend: "Message" button inside ticket card → redirects to conversation

**1.2 Customer-raised tickets**

- [ ] Backend: `POST /api/tickets` — create ticket (title, description, image optional)
- [ ] Backend: `GET /api/tickets/mine?status=pending|ongoing|completed|cancelled`
- [ ] Backend: `PUT /api/tickets/{id}/cancel`
- [ ] Backend: 🔗 Ticket creation form should optionally pull order context from `api-oos` (e.g., "raise a concern about Order #1234")
- [ ] Frontend: Customer ticket tabs (Pending / Ongoing / Completed / Cancelled)
- [ ] Frontend: Create ticket form (title, description, image upload, optional order reference)
- [ ] Frontend: Ticket detail view + cancel action
- [ ] Frontend: "Message" button inside ticket card

---

## EPIC 2: Support Chat (P0)

**2.1 Internal conversation inbox (Employee/Manager/Staff)**

- [ ] Backend: SignalR hub for real-time messaging (shared with `br-online-shop` chat widget — see 🔗 note below)
- [ ] Backend: `GET /api/conversations?tab=unread|read|all`
- [ ] Backend: `PUT /api/messages/{id}/read`, `PUT /api/messages/{id}/unread`
- [ ] Backend: `POST /api/conversations/{id}/messages` — send message
- [ ] Backend: `GET /api/messages/{id}` — message detail
- [ ] Frontend: Unread / Read / All tabs
- [ ] Frontend: Active conversations list (sourced from claimed tickets)
- [ ] Frontend: Mark as read/unread toggle
- [ ] Frontend: Real-time message send/receive UI
- [ ] Frontend: Message detail view

**2.2 Customer-facing chat**

- [ ] Backend: 🔗 Chat endpoint consumed directly by `br-online-shop`'s floating chat widget (`web-shop`) via the shared SignalR hub in `api-crm`
- [ ] Backend: Bot-first flow — route to AI agent bot before offering human handoff (🔗 uses `api-ai-analytics` intent detection, see Epic 5)
- [ ] Backend: `PUT /api/tickets/{id}/cancel` reachable from within conversation view
- [ ] Frontend: Customer chat panel (redirected from ticket "Message" button, or opened from `web-shop` widget)
- [ ] Frontend: Bot conversation UI before human agent handoff
- [ ] Frontend: Cancel ticket action inside conversation
- [ ] Frontend: Message detail view

---

## EPIC 3: Feedback & Ratings (P0)

**3.1 Product feedback & ratings**

- [ ] Backend: 🔗 `GET /api/products/{id}/feedback` — reads product identity from `api-oos`, stores feedback/ratings in `api-crm`
- [ ] Backend: `POST /api/products/{id}/feedback` — submit feedback + rating (max 500 chars, 1–5 stars)
- [ ] Backend: Validation — 500 char max, 1–5 star range, one review per user per product
- [ ] Backend: 🔗 Note: this overlaps with `br-online-shop` Epic 5.4 (Product reviews & ratings, `POST /api/reviews`) — needs a decision on system of record (see integration backlog)
- [ ] Frontend: Average rating + feedback list on product page
- [ ] Frontend: Submit feedback form (star selector, textarea, char counter)
- [ ] Frontend: Display rating, feedback text, and date only (no reviewer PII)

---

## EPIC 4: AI-Analytics — Customer Profiles (P1)

**4.1 Customer segmentation**

- [ ] Backend (`api-ai-analytics`): Segment customers (New, High-Value, At-Risk, Dormant, Loyal) using order history 🔗 from `api-oos`, engagement/activity from `api-crm`
- [ ] Backend: `GET /api/ai/customers/{id}/segment`
- [ ] Backend: Scheduled recalculation job (define cadence)
- [ ] Frontend (`web-crm`): Segment badge on customer profile
- [ ] Frontend: Filter/sort customer list by segment

**4.2 Churn / at-risk prediction**

- [ ] Backend: Score churn risk from 🔗 order frequency decline (`api-oos`) + negative ticket sentiment (`api-crm`/`api-ai-analytics`) + inactivity
- [ ] Backend: `GET /api/ai/customers/{id}/churn-score`
- [ ] Backend: Configurable risk threshold (admin-settable, not hardcoded)
- [ ] Frontend: Churn score + risk flag on customer profile
- [ ] Frontend: Sort/filter by churn risk

**4.3 Customer Lifetime Value (CLV) prediction**

- [ ] Backend: Predict CLV from 🔗 purchase history (`api-oos`) and behavior patterns
- [ ] Backend: `GET /api/ai/customers/{id}/clv`
- [ ] Frontend: CLV display on customer profile
- [ ] Frontend: Sort customers by predicted CLV

**4.4 Next-best-action recommendation**

- [ ] Backend: Depends on 4.1–4.3 outputs (segment, churn, CLV) — generate recommended action
- [ ] Backend: `GET /api/ai/customers/{id}/next-action`
- [ ] Backend: Log accepted/dismissed/completed outcomes for future model tuning
- [ ] Frontend: Recommendation card on customer profile with accept/dismiss/complete actions

---

## EPIC 5: AI-Analytics — Tickets & Conversations (P1)

**5.1 Sentiment analysis (tickets)**

- [ ] Backend: Classify ticket text sentiment (positive/neutral/negative) on creation
- [ ] Backend: Fallback: if model confidence is low, mark "Unclassified" rather than guessing
- [ ] Frontend: Sentiment badge on ticket list/detail
- [ ] Frontend: Filter tickets by sentiment

**5.2 Auto-categorization (tickets)**

- [ ] Backend: Auto-tag ticket type (billing, shipping, technical, complaint, refund, etc.)
- [ ] Backend: 🔗 "Shipping" / "Refund" categories may query `api-oos` for order status context
- [ ] Backend: Fallback to "Uncategorized" + manual tagging on low confidence
- [ ] Frontend: Category tag on ticket, manual override control
- [ ] Frontend: Filter tickets by category

**5.3 Urgency/priority scoring**

- [ ] Backend: Combine sentiment + CLV (Epic 4.3) + ticket content into a priority score
- [ ] Backend: Configurable scoring weights (admin-settable)
- [ ] Frontend: Priority badge on ticket list, sort by priority

**5.4 Resolution time prediction**

- [ ] Backend: Estimate resolution time from category + historical data
- [ ] Frontend: Estimated resolution time on ticket detail

**5.5 Ticket volume forecasting**

- [ ] Backend: Forecast ticket volume from historical trends + known campaign/launch events
- [ ] Frontend: Forecast chart (dashboard)
- [ ] Frontend: Threshold-based alert when forecast exceeds staffing capacity

**5.6 Real-time sentiment tracking (conversations)**

- [ ] Backend: Per-message sentiment analysis in live conversation
- [ ] Backend: Escalation flag when sentiment trends negative
- [ ] Frontend: Escalation indicator in conversation view

**5.7 Auto-summarization**

- [ ] Backend: Generate conversation summary on demand / on reassignment
- [ ] Frontend: Summary panel at top of conversation view, regenerate action

**5.8 Smart reply suggestions**

- [ ] Backend: Generate contextual quick-reply suggestions
- [ ] Frontend: Suggestion chips — select / edit / dismiss

**5.9 Intent detection**

- [ ] Backend: Classify customer message intent (question, complaint, refund request, etc.)
- [ ] Backend: 🔗 Feeds the bot-first flow in Epic 2.2 (customer chat) to decide bot vs. human handoff
- [ ] Frontend: Detected intent shown in conversation view

**5.10 Key entity/topic extraction**

- [ ] Backend: Extract product names, order numbers, dates from conversation text
- [ ] Backend: 🔗 Extracted order numbers should link to order detail via `api-oos`
- [ ] Frontend: Extracted entities panel alongside conversation, clickable order number

**5.11 AI chatbot / virtual assistant (ecommerce-facing)**

- [ ] Backend: FAQ handling, order status lookup (🔗 `api-oos`), simple request handling
- [ ] Backend: Escalation to human agent via Epic 2.2 flow when bot can't resolve
- [ ] Backend: Log chatbot conversations for quality review
- [ ] Frontend (`web-shop`): 🔗 Chatbot widget lives in `br-online-shop`, calls `api-ai-analytics`/`api-crm` endpoints

---

## EPIC 6: AI-Analytics — Campaigns (P2)

**6.1 Lead/customer scoring for targeting**

- [ ] Backend: Score customers by likelihood to respond to a given campaign
- [ ] Frontend: Audience builder with score threshold filter

**6.2 Send-time optimization**

- [ ] Backend: Predict optimal send time per customer from engagement history
- [ ] Frontend: Enable/disable send-time optimization when scheduling a campaign

**6.3 Campaign performance prediction**

- [ ] Backend: Forecast open/click/conversion rate pre-send
- [ ] Frontend: Forecast panel on campaign preview screen

**6.4 AI-generated content suggestions**

- [ ] Backend: LLM-generated subject line / copy suggestions
- [ ] Frontend: Suggestion picker (select / edit / regenerate)

---

## EPIC 7: Dashboard (P1)

**7.1 Unified analytics dashboard**

- [ ] Backend: Aggregate churn, sentiment, campaign, and ticket metrics into a single query/view
- [ ] Backend: 🔗 Order/revenue metrics pulled from `api-oos` where relevant
- [ ] Frontend: Dashboard page — combined widgets, date range filter, drill-down

**7.2 Campaign ROI / trend analytics**

- [ ] Backend: Performance trends by segment, channel, tier
- [ ] Frontend: Trend charts, campaign comparison view

**7.3 Anomaly detection**

- [ ] Backend: Detect and flag unusual patterns (ticket spikes, engagement drops, 🔗 unusual order cancellations from `api-oos`)
- [ ] Backend: Notification on high-severity anomalies
- [ ] Frontend: Anomaly feed on dashboard, acknowledge/dismiss action

**7.4 Natural language query/search**

- [ ] Backend: Translate plain-English query into filtered data search (LLM-powered)
- [ ] Frontend: NL query input box, results table/visualization, "no results" handling

---

## EPIC 8: Cross-Cutting — AI-Analytics Governance (P1)

- [ ] Backend: Data ingestion strategy defined for `api-ai-analytics` (event-driven vs. scheduled sync vs. direct query) — 🔗 applies to both `api-crm` and `api-oos` sources
- [ ] Backend: Model versioning / retraining cadence documented
- [ ] Backend: PII handling policy for churn score, CLV, and segmentation data
- [ ] Backend: Graceful degradation — defined fallback behavior when AI service is unavailable or low-confidence, per feature
- [ ] Backend: Admin configuration panel/endpoints for thresholds and scoring weights (churn threshold, priority weights, anomaly sensitivity)
- [ ] Frontend: Admin settings UI for the above thresholds/weights

---

## Open Items Before Sprint Planning

- [ ] Assign concrete priorities (replace "TBD") and sequence by dependency (Segmentation/CLV → Next-Best-Action; Sentiment → Priority Scoring)
- [ ] Resolve system-of-record conflict: product reviews exist in both this backlog (Epic 3.1) and `br-online-shop` Epic 5.4
- [ ] Confirm whether `api-ai-analytics` is a separate deployable service or a module within `api-crm`

---
