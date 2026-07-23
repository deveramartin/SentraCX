# Implementation Report: Epic E - Model Lifecycle & Data Governance

This report summarizes the implementation of Epic E (Model Lifecycle & Data Governance) inside the `api-ai-analytics` service.

## What Was Built
We introduced comprehensive support for model lifecycle version tracking, PII redaction/anonymization for external LLM calls (Groq), and database-level data retention compliance using MongoDB TTL indexes.

## Key Architectural Decisions
- **Settings-Driven Versioning**: Configured default model semantic versions inside FastAPI Settings (Pydantic). When predictions are made or customer features are logged, the active model versions are stored alongside the documents in MongoDB for traceability.
- **Regular Expression-based Anonymization**: Implemented high-performance precompiled regular expressions in `anonymizer.py` to strip out critical PII (Emails, Phone Numbers, Credit Cards, SSN) before messages are compiled into LLM prompts.
- **MongoDB TTL Indexes**: Automated index setup on application boot to drop ticket analysis documents and customer feature logs older than configured retention limits (default 90 days), utilizing native database-level TTL indices.

## Files Touched
- `[MODIFY]` [config.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/core/config.py) — Added settings for model versions and data retention duration.
- `[MODIFY]` [customer_models.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/models/customer_models.py) — Added `model_versions` to `CustomerFeatureLogsDocument`.
- `[MODIFY]` [ticket_models.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/models/ticket_models.py) — Added `model_version_sentiment` and `model_version_category` to `ConversationTranscriptDocument`.
- `[MODIFY]` [customer_feature_repository.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/repositories/mongo/customer_feature_repository.py) — Updated `save_feature_log` to support persisting active model versions.
- `[MODIFY]` [conversation_transcript_repository.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/repositories/mongo/conversation_transcript_repository.py) — Updated `save_analysis` to persist active model versions and store `analyzed_at` as a `datetime` object.
- `[MODIFY]` [customer_insights_service.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/services/customer_insights_service.py) — Resolved setting model versions on feature log insert.
- `[MODIFY]` [ticket_analysis_service.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/services/ticket_analysis_service.py) — Added active model versions to the mongo analysis document.
- `[NEW]` [anonymizer.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/helpers/anonymizer.py) — Implemented PII redaction utility.
- `[MODIFY]` [groq_client.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/lib/groq_client.py) — Sanitized user prompts via the anonymizer helper.
- `[MODIFY]` [mongo.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/db/mongo.py) — Added automated index generation.
- `[MODIFY]` [main.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/app/main.py) — Bootstrapped index generation during the lifespan connection lifecycle.
- `[NEW]` [test_anonymizer.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/tests/helpers/test_anonymizer.py) — Unit tests for PII regex helper.
- `[NEW]` [test_mongo_indexes.py](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-ai-analytics/tests/repositories/mongo/test_mongo_indexes.py) — Unit tests for Mongo index configuration.

## Testing
- Unit tests cover the PII anonymizer helper extensively, proving that emails, phone numbers (with optional + prefix/hyphens/spaces), credit cards, and SSNs are fully redacted.
- Unit tests mock MongoDB and confirm the database setup registers the correct TTL configuration based on setting variables.
- Verified all service tests pass cleanly by running `pnpm test:ai` from root.
