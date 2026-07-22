---
name: git-and-pr-workflow
description: Commit conventions, branch naming, and PR checklist for SentraCX. Load when committing, branching, or opening a PR.
category: Developer Experience
---

## Objective
Maintain a clean, traceable git history and structured Pull Requests across all SentraCX services.

## Instructions
1. Follow commit standards:
   - Commit after every completed task. Do not batch unrelated tasks into one commit, and do not leave completed tasks uncommitted before starting the next.
   - Use Conventional Commits format: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`.
   - Scope to the relevant service when applicable (e.g., `feat(crm): add campaign recurrence field`, `fix(web): correct ticket status label mapping`).
   - Limit each commit to a single concern matching the one-responsibility-per-file rule.
   - Never commit build artifacts (`bin/`, `obj/`, `__pycache__/`, `.next/`, `node_modules/`, `*.pdb`, `.venv/`). Confirm `.gitignore` coverage.

2. Follow branch and PR rules:
   - Branch naming: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`, `docs/<short-desc>`.
   - Never commit directly to `main`. Work on feature branches and merge via PR.
   - PR title must follow Conventional Commit format (e.g., `feat(ai-analytics): add churn score caching layer`).
   - PR descriptions must include:
     - **What changed** (short summary)
     - **Why** (link plan doc in `docs/plans/implementations/` if available)
     - **How it was tested**
     - **Schema/architecture impact** (link updated docs in `docs/architecture/` and confirm Mermaid diagram updates).
   - Keep PRs strictly scoped to one feature or fix.

## Validation Checklist
* [ ] Commit messages follow Conventional Commits standard with service scoping where relevant.
* [ ] No build artifacts or environment files are staged or committed.
* [ ] PR description contains What, Why, How Tested, and Schema Impact sections.
* [ ] PR is submitted from a feature branch, not directly to `main`.