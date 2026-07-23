# Admin Configuration (Epic D) Implementation Plan

## Goal Description
Implement Epic D from the AI Analytics backlog, which provides admin configuration for AI thresholds, weights, and sensitivities. This involves creating a set of configuration endpoints in the Python FastAPI `api-ai-analytics` service backed by MongoDB (persistent) and Redis (hot cache), along with an audit log of changes. We will also update the Next.js `web-crm` Settings page to allow managers/admins to modify these values.

## User Review Required
> [!IMPORTANT]
> - Are there specific RBAC role names (e.g., `"admin"`, `"manager"`) we should check for on the Next.js frontend to restrict the AI Thresholds tab?
> - For `confidence-thresholds` and `priority-weights`, do you prefer individual endpoints or a single `/api/ai/config` endpoint that handles all config at once? The backlog specifies individual `GET/PUT /api/ai/config/...` endpoints, so the plan implements them individually, but we can combine them if it's easier for the frontend.

## Proposed Changes

---

### Backend (apps/api-ai-analytics)

#### [NEW] app/schemas/config_schemas.py
- Define request and response schemas for configurations: `ChurnThresholdConfig`, `PriorityWeightsConfig`, `AnomalySensitivityConfig`, `ConfidenceThresholdsConfig`.
- Define `ConfigAuditResponse` schema for audit logs.

#### [NEW] app/models/config_models.py
- Internal MongoDB document shapes for configurations and `ConfigAuditLog`.

#### [NEW] app/repositories/mongo/config_repository.py
- Implements `get_config(key: str)` and `update_config(key: str, value: dict)`.
- Implements `log_audit(key: str, changed_by: str, old_value: dict, new_value: dict)`.

#### [NEW] app/repositories/redis/config_cache_repository.py
- Implements `get_cached_config(key: str)` and `set_cached_config(key: str, value: dict)` for hot reads.

#### [NEW] app/services/config_service.py
- Orchestrates getting and setting configs.
- On `GET`: Tries Redis first. If missing, gets from Mongo and sets Redis.
- On `PUT`: Updates Mongo, writes to Audit log in Mongo, updates Redis cache.

#### [NEW] app/api/v1/routes/config.py
- Defines the endpoints specified in the backlog:
  - `GET/PUT /api/ai/config/churn-threshold`
  - `GET/PUT /api/ai/config/priority-weights`
  - `GET/PUT /api/ai/config/anomaly-sensitivity`
  - `GET/PUT /api/ai/config/confidence-thresholds`

#### [MODIFY] app/api/v1/deps.py
- Add `get_config_service()` injection dependency.

#### [MODIFY] app/main.py
- Include the new `config` router in the FastAPI app.

---

### Frontend (apps/web-crm)

#### [MODIFY] src/components/features/settings/SettingsPage.tsx
- Add a new tab `AI Thresholds` to the existing `SettingsPage`.
- Add form fields corresponding to Churn Threshold, Priority Weights, Anomaly Sensitivity, and Confidence Thresholds.
- Add role-based rendering (only show this tab if user is a manager/admin - using NextAuth session data).

#### [MODIFY] src/lib/api/crm-client.ts (or equivalent analytics client)
- Add frontend API calls to fetch and update the configurations from `api-ai-analytics`.

#### [NEW] src/types/config.ts
- Define TypeScript interfaces matching the backend configuration schemas.

## Verification Plan

### Automated Tests
- `pytest` for `config_service.py` verifying cache fallback logic and audit logging.
- `pytest` for `routes/config.py` verifying API contracts.

### Manual Verification
- Deploy services locally using `dev-setup` instructions.
- Log in to the web-crm portal as an admin.
- Navigate to Settings -> AI Thresholds.
- Update a threshold and save.
- Verify in MongoDB that the `config` and `config_audit` collections are updated.
- Verify in Redis that the hot-cache is updated.
