---
name: testing
description: Test locations, naming conventions, and run commands for CRM (.NET), AI-Analytics (Python/pytest), and Web (Jest/React Testing Library). Load when writing or running tests, or adding new business logic.
category: Quality
---

## Objective
Enforce testing standards, 1:1 test directory mirroring, and mandatory test coverage for new business logic across all SentraCX services.

## Instructions
1. Test CRM (.NET):
   - Location: `apps/api-crm/tests/Crm.Api.Tests` mirroring the source structure 1:1 (`Controllers/`, `Services/`, `Helpers/`, `Hubs/`). One test class per class under test.
   - Run: `dotnet test` from `apps/api-crm` or `pnpm test:api` from root.

2. Test AI-Analytics (FastAPI):
   - Location: `apps/api-ai-analytics/tests/` mirroring `app/` structure 1:1 (e.g. `tests/services/test_customer_insights_service.py` for `app/services/customer_insights_service.py`).
   - Run: `python -m pytest tests/ -v` (inside `.venv`) or `pnpm test:ai` from root.

3. Test Web (Next.js):
   - Location: `apps/web-crm/src/__tests__/` mirroring `src/` structure (e.g. `src/__tests__/hooks/useCustomers.test.ts`). Do not colocate `.test.tsx` files next to source code files.
   - Run: `pnpm test` from `apps/web-crm` or `pnpm test:web` from root.

4. Execute test suites and require PR test coverage:
   - Run the relevant service's test suite before committing changes to that service.
   - Include corresponding tests in the same PR whenever adding new business logic (services, hooks, repositories). Do not defer test writing.

## Validation Checklist
* [ ] Test file paths mirror corresponding source file paths 1:1.
* [ ] No test files are colocated beside source files in `apps/web-crm`.
* [ ] Relevant test commands (`pnpm test:api`, `pnpm test:ai`, `pnpm test:web`) pass cleanly.
* [ ] New business logic is accompanied by unit/integration test coverage in the same PR.