<!--
  Title should follow Conventional Commits, e.g.:
  feat(crm): add campaign recurrence field
  fix(web): correct ticket status label mapping
  refactor(ai-analytics): split churn repository from service
-->

## What changed

<!-- Short summary of the change. What was built, fixed, or refactored. -->

## Why

<!-- The reason for this change. Link the plan doc if one exists. -->
Plan: `docs/plans/implementations/<feature-name>.md` (if applicable)
Fix report: `docs/fix-reports/<bug-name>.md` (if applicable)

## Service(s) touched

- [ ] CRM (`apps/api-crm`)
- [ ] AI-Analytics (`apps/api-ai-analytics`)
- [ ] Web (`web`)

## How this was tested

<!-- What you ran, what you checked. Be specific — "tested locally" is not enough. -->

## Schema / architecture impact

- [ ] No data model changes
- [ ] Data model changed — updated `docs/architecture/crm-data-model.md`
- [ ] Data model changed — updated `docs/architecture/ai-analytics-data-model.md`
- [ ] Mermaid diagram(s) updated in the same PR

## Checklist

- [ ] Every changed file has one clear concern (no mixed responsibilities)
- [ ] No file exceeds ~200 lines
- [ ] No new `containers/` layer or unnecessary Context added in `web/`
- [ ] `page.tsx` files (if touched) only compose components — no logic inline
- [ ] New folders (if any) are decoupled from unrelated existing folders
- [ ] Tests added/updated for new logic (mirrors source structure)
- [ ] No build artifacts committed (`bin/`, `obj/`, `__pycache__/`, `.next/`, `node_modules/`)
- [ ] Commits follow Conventional Commits and are scoped to one concern each

## Related issues

<!-- Link related tickets/issues -->
