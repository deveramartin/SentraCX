---
name: frontend-development
description: General frontend development guidelines for SentraCX. Load for general front-end work not covered by web-nextjs-structure or next-refactor.
category: Frontend
---

## Objective
Establish frontend best practices, UI component guidelines, design system usage, and state management rules for SentraCX user interfaces.

## Instructions
1. Follow SentraCX design system guidelines:
   - Use `shadcn/ui` primitives (`new-york`, `neutral`) located under `apps/web-crm/src/components/ui/`.
   - Use Tailwind CSS v4 design tokens from `globals.css` (OKLCH variables). Never hardcode color values.
   - Use `lucide-react` as the exclusive icon library.
   - Use Hanken Grotesk and Geist Mono font pairings.
2. Adhere to component and state conventions:
   - Maintain single responsibility per component file under ~200 lines.
   - Prefer local state → custom hooks → lightweight store before reaching for React Context.
   - Keep page components in `app/` free of business logic and inline data fetching; compose feature components instead.

## Validation Checklist
* [ ] UI components utilize shadcn/ui and lucide-react icons exclusively.
* [ ] Colors reference OKLCH variables/tokens from `globals.css` without hardcoded hex/RGB values.
* [ ] Components remain under ~200 lines and maintain single responsibility.
