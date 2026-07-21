# CRM Product Backlog — Frontend

Each item maps to its BRD requirement(s) where applicable, so tasks can be traced back to BR/FR IDs.

---

## Sprint 1

### CRM-001 — Customer Profiles (Contacts & Leads)
*Maps to: BR-CRM-01*

- [x] Customer module with separate tabs for **contacts** and **leads**
- [x] Contact/lead list view showing name, email, phone (optional), customer type, created at
- [x] "Add new customer contact/lead" form: first name, last name, email, phone (optional), customer type
- [x] Delete customer contact/lead action (with confirmation)
- [x] Customer detail page, opened by clicking a customer's name, with three tabs: **Overview**, **Marketing History**, **Order History**
- [x] Overview tab: display name, email, address (optional), created at, status, customer type, profile (optional), plus the 5 most recent order history and marketing history items
- [x] Status control on the detail page: active / inactive / suspended
- [x] Customer type control: vip / regular / institutional buyer — disabled/locked for leads (always shows "lead")
- [x] Optional notes field/section on the customer profile
- [x] Marketing History tab: paginated list; clicking an item opens details (title, description, channel, interaction type, sent at)
- [x] Order History tab: paginated list; clicking an item opens order details — **hide this tab entirely for leads**, show only for customer contacts
- [ ] ~~Email button on profile redirecting to campaign~~ — marked **Discarded** in source, confirm before building

---

## Sprint 2

### CRM-002 — Campaigns
*Maps to: BR-CRM-05, BR-CRM-06*

- [ ] Campaigns module with three tabs: Campaign List, Campaign Drafts, Campaign History
- [ ] "Create campaign" button/entry point
- [ ] Campaign List tab: active campaigns, click to view details
- [ ] Campaign Drafts tab: drafted campaigns, click to view/edit details
- [ ] Campaign History tab: ended campaigns, click to view details
- [ ] Create-campaign form: title, subject, description (all required), channel selection (email, in-app), schedule options (send now, scheduled, recurring on Mon/Tue/Wed), optional image upload
- [ ] Template picker within the create-campaign flow
- [ ] "Save as draft" action

### CRM-003 — Promotions
*Maps to: BR-CRM-05*

- [ ] Promotions views: all/active, drafted, cancelled, accomplished — each clickable to view details
- [ ] Create-promotion form: title, description, promotion type (discount, voucher, free shipping, buy-one-get-one, cashback), discount value, voucher code, start date, end date
- [ ] "Save as draft" action for promotions
- [ ] Edit/update UI for a drafted promotion
- [ ] Stop/cancel action for an active promotion

### CRM-004 — Campaign–Promotion Linking
- [ ] Multi-select promotion picker inside the campaign create/edit form, so several promotions can be attached to one campaign

### CRM-005 — Tickets (Staff/Manager view)
*Maps to: BR-CRM-02*

- [ ] Tickets module with tabs: Available (unclaimed), Claimed, Completed
- [ ] Ticket details view on click
- [ ] Claim / unclaim button on each ticket
- [ ] "Message" button on a ticket that redirects to its conversation

### CRM-006 — Tickets (Customer view)
*Maps to: BR-CRM-02*

- [ ] Ticket module with tabs: Pending, Ongoing, Completed, Cancel
- [ ] "Create ticket" form: title, description, image (optional)
- [ ] Ticket details view on click
- [ ] Cancel-ticket action
- [ ] "Message" button within each ticket component

---

## Sprint 3

### CRM-007 — Conversations (Staff/Manager view)
*Maps to: BR-CRM-03, BR-CRM-04*

- [ ] Conversations module with tabs: Unread, Read, All
- [ ] Active conversation list on the user's page (sourced from claimed tickets)
- [ ] Mark-as-read / mark-as-unread control
- [ ] Real-time chat UI: send and receive messages live
- [ ] Message/conversation details view
- [ ] "Completed" and "Unclaim" buttons inside the conversation view
- [ ] Deep link: clicking the "message" button on a ticket routes here, opening the right conversation

### CRM-008 — Conversations (Customer view)
*Maps to: BR-CRM-03, BR-CRM-04*

- [ ] Real-time chat UI for messaging staff
- [ ] Bot-first chat experience: show the agent bot's responses before offering escalation
- [ ] "Talk to a real agent" prompt/option shown when the bot's response isn't sufficient
- [ ] Cancel-ticket action available inside the conversation view
- [ ] Message/conversation details view

---

## Sprint — Feedback & Ratings

### CRM-009 — Feedback & Ratings
*Maps to: BR-CRM-07*

- [ ] Product page section showing all feedback and the average rating
- [ ] "Send feedback / rate" form: text input (max 500 characters, enforced client-side) and a 1–5 rating selector
- [ ] Feedback list display: rating, feedback text, and date only (no other fields)

---

## Notes for handoff
- Frontend and backend backlogs share the same CRM-### IDs so tasks stay traceable to one source of truth (the BRD).
- Role-based UI gating (hiding/disabling controls per role: Admin, CEO, Manager, Support, Marketing per BR-CRM-08) isn't itemized per module above — recommend adding a cross-cutting checklist once role permissions are finalized on the backend.