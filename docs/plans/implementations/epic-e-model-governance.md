# Implementation Plan: Epic E - Model Lifecycle & Data Governance

This document details the implementation plan for Epic E of the `api-ai-analytics` service, covering model versioning, PII handling, data retention, and documentation.

## Affected Services
- `api-ai-analytics` (Python/FastAPI)

## Proposed Changes

### 1. Configuration
Modify `apps/api-ai-analytics/app/core/config.py` to add model versions and retention policies.

```python
    # Model Versions
    model_version_churn: str = "1.0.0"
    model_version_clv: str = "1.0.0"
    model_version_sentiment: str = "1.0.0"
    model_version_category: str = "1.0.0"

    # Data Governance
    data_retention_days: int = 90
```

### 2. Models & Database
Update the MongoDB models to persist the model version that computed the analysis.
- `apps/api-ai-analytics/app/models/customer_models.py`
  - Add `model_version: str | None = None` to `CustomerFeatureLogsDocument`.
- `apps/api-ai-analytics/app/models/ticket_models.py`
  - Add `model_version: str | None = None` to `ConversationTranscriptDocument`.

Modify `apps/api-ai-analytics/app/db/mongo.py` to configure MongoDB TTL indexes on initialization:
- Create a `setup_indexes()` function that creates a TTL index on:
  - `ConversationTranscripts` collection on the `analyzed_at` field.
  - `customer_feature_logs` collection on the `recorded_at` field (or we can use a separate retention mechanism if needed, but TTL index is perfect).

Call `setup_indexes()` within the lifespan handler in `apps/api-ai-analytics/app/main.py`.

### 3. PII Redaction
Create a PII anonymization helper under `apps/api-ai-analytics/app/helpers/anonymizer.py`:
- Implement a `redact_pii(text: str) -> str` function using high-performance regex patterns to identify and mask:
  - Emails
  - Phone numbers
  - Social Security Numbers (SSN) / national IDs
  - Credit card numbers
- Integrate `redact_pii` into `apps/api-ai-analytics/app/lib/groq_client.py` before strings are compiled into LLM prompts.

## Verification
- **Unit Tests**:
  - `apps/api-ai-analytics/tests/helpers/test_anonymizer.py` to verify PII masking works correctly with various input formats.
  - `apps/api-ai-analytics/tests/db/test_mongo.py` to verify TTL indexes are defined programmatically.
- **Manual Verification**: Run `pnpm dev:ai` to ensure the service boots and indexes are created.
