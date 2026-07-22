---
name: next-refactor
description: Refactors recently created Next.js pages, components, and files to meet the ~200-line cap and single-concern rules. Load after creating any new Next.js file that may need splitting.
category: Frontend
---

## Objective
Ensure all Next.js pages, components, and utility files in `apps/web-crm` adhere to the ~200-line hard cap, maintain single responsibility, and match project structure guidelines.

## Instructions
1. Inspect targeted Next.js pages, components, or files for size and complexity.
2. Identify readability, maintainability, or structure improvements:
   - Check if the file exceeds ~200 lines of code. If so, extract sub-components, hooks, or helper modules.
   - Verify each file has a single, concise responsibility. Split files handling multiple concerns.
3. Perform the refactoring:
   - Ensure extracted components and helper files are correctly named, typed, and imported.
   - Follow the Next.js directory structure specified in `web-nextjs-structure`.
4. Validate functionality and tests:
   - Verify that refactored code passes existing test suites and add new tests if required.

## Validation Checklist
* [ ] Target file is under ~200 lines of code.
* [ ] Component or file handles exactly one concern.
* [ ] Folder placement follows conventions under `apps/web-crm/src/`.
* [ ] Tests pass after refactoring.