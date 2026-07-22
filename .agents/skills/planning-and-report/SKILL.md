---
name: planning-and-report
description: Workflow for writing feature plans, bug-fix reports, and implementation reports for SentraCX. Load when asked to produce a plan, bug-fix report, or implementation report.
category: Process
---

## Objective
Standardize the creation of feature plans, bug fix post-mortems, and feature implementation reports across the monorepo.

## Instructions
1. Plan feature additions or changes:
   - Ask the user first if requirements, data shape, service boundaries, or UI specs are ambiguous.
   - Save feature implementation plans to `docs/plans/implementations/<feature-name>.md`.
   - Specify affected service(s), expected file/folder modifications, and related architecture/data docs to update.

2. Document non-trivial bug fixes:
   - Create a short report saved to `docs/fix-reports/<short-bug-description>.md`.
   - Include:
     - **Symptom**: What was broken.
     - **Root Cause**: Why it broke.
     - **Fix**: Touched files and logic modifications.
     - **Verification**: How the fix was validated.

3. Document completed feature implementations:
   - Save report to `docs/implementation-reports/<feature-name>.md`.
   - Include:
     - **What was built**: Feature overview.
     - **Key architectural decisions**: Design choices made.
     - **Files touched**: Created or modified files.
     - **Testing**: Verification details.

## Validation Checklist
* [ ] Clarifying questions were resolved with the user before writing implementation plans.
* [ ] Feature plan is written to `docs/plans/implementations/<feature-name>.md`.
* [ ] Bug fix report is written to `docs/fix-reports/<short-bug-description>.md`.
* [ ] Implementation report is written to `docs/implementation-reports/<feature-name>.md`.