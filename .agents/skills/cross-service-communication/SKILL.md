---
name: cross-service-communication
description: Rules for any call between CRM and AI-Analytics or any new sync mechanism (webhook, scheduled pull, etc.). Load when wiring communication between the two services.
category: Architecture
---

## Objective
Enforce clear boundaries and REST-only API interaction between CRM (.NET) and AI-Analytics (FastAPI) microservices without shared database access or duplicated state.

## Instructions
1. Ensure services communicate only over REST HTTP APIs:
   - CRM never queries AI-Analytics' databases directly.
   - AI-Analytics never queries CRM's PostgreSQL directly.
2. Manage service calls via client interfaces:
   - AI-Analytics calls the CRM API via `app/lib/crm_client.py` (async `httpx` client).
   - AI-Analytics stores only reference IDs pointing back to CRM records, never duplicating data ownership.
   - CRM calls AI-Analytics REST endpoints for customer insights (churn, CLV, Next-Best-Action) when rendering customer detail views.
3. Document all communication channels:
   - Document any new sync mechanism (webhook, scheduled pull, event stream) in `docs/architecture/` rather than leaving it implied in code.

## Validation Checklist
* [ ] No direct database access or connection sharing exists between CRM and AI-Analytics.
* [ ] Outbound HTTP calls from AI-Analytics use `crm_client.py`.
* [ ] New sync mechanisms are documented under `docs/architecture/`.