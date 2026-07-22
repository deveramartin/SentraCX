---
name: web-nextjs-structure
description: Strict folder structure, layering rules, and naming conventions for apps/web-crm (Next.js 16 / React 19). Load when creating or editing any file under apps/web-crm.
category: Frontend
---

## Objective
Enforce strict structural conventions, component isolation, and file-placement rules for `apps/web-crm`.

## Instructions
1. Follow the standard directory structure for `apps/web-crm`:
   ```
   apps/web-crm/
   ├── src/
   │   ├── app/                            → App Router routes — PAGES ONLY, no logic
   │   │   ├── api/auth/                   → NextAuth.js route handler
   │   │   ├── customers/
   │   │   │   ├── page.tsx
   │   │   │   └── [id]/page.tsx
   │   │   ├── tickets/page.tsx
   │   │   ├── campaigns/page.tsx
   │   │   ├── conversations/page.tsx
   │   │   ├── dashboard/page.tsx
   │   │   ├── settings/page.tsx
   │   │   ├── signin/page.tsx
   │   │   ├── layout.tsx
   │   │   └── globals.css
   │   ├── components/
   │   │   ├── ui/                         → shadcn/ui primitives only — no business logic here
   │   │   ├── shared/                     → cross-feature reusable components
   │   │   │   ├── AppShell.tsx            → root layout wrapper (auth gate + shell)
   │   │   │   ├── Header.tsx              → top navigation bar
   │   │   │   ├── Sidebar.tsx             → side navigation
   │   │   │   └── MobileNav.tsx           → mobile navigation drawer
   │   │   └── features/
   │   │       ├── customers/              → CustomerDetail.tsx, CustomerProfiles.tsx, etc.
   │   │       ├── tickets/                → Tickets.tsx
   │   │       ├── campaigns/              → Campaigns.tsx
   │   │       ├── conversations/          → Conversations.tsx
   │   │       ├── dashboard/              → Dashboard.tsx
   │   │       └── settings/              → SettingsPage.tsx
   │   ├── hooks/                          → one custom hook per file (useCustomers.ts, etc.)
   │   ├── lib/
   │   │   ├── api/                        → API client modules — crm-client.ts
   │   │   ├── validators/                 → zod schemas / form validation
   │   │   └── utils.ts                    → pure utility functions (cn(), etc.)
   │   ├── types/                          → shared TypeScript types/interfaces
   │   │   ├── customer.ts
   │   │   └── next-auth.d.ts
   │   ├── __tests__/                      → mirrors src/ structure 1:1
   │   │   ├── components/features/
   │   │   ├── hooks/
   │   │   └── lib/
   │   ├── __mocks__/                      → Jest module mocks
   │   ├── auth.ts                         → NextAuth.js configuration
   │   ├── proxy.ts                        → middleware proxy helper
   │   └── instrumentation.ts             → Next.js instrumentation hook
   ├── public/
   ├── components.json                     → shadcn/ui configuration
   ├── tailwind.config.ts                  → Tailwind v4 theme overrides
   ├── next.config.ts
   ├── tsconfig.json
   └── package.json
   ```

2. Enforce hard structural rules:
   - **Pages only render components. No logic.** A `page.tsx` file's job is composition only:
     ```tsx
     export default function CustomersPage() {
       return <CustomerProfiles />
     }
     ```
     Data fetching, state, and business logic live in components/hooks/lib, never inline in page files.
   - **No `containers/` folder, and no global Context wrapping anti-pattern.** Prefer: local state → custom hook → lightweight store. Context is reserved for global concerns (auth session, theme).
   - **shadcn/ui primitives stay in `components/ui/`.** Do not place business logic in `components/ui/`. Add new shadcn primitives via `npx shadcn@latest add <component>` inside `apps/web-crm/`.
   - **`lucide-react` is the only icon source.** Never import or inline SVG icons from other packages.
   - **Feature folders are isolated.** `components/features/tickets/` must not import from `components/features/campaigns/` directly. Promote shared code to `components/shared/` or `lib/`.
   - **Tailwind v4 & CSS variables.** Use design tokens in `globals.css` (OKLCH properties). Never hardcode color values.
   - **Tests in `src/__tests__/`.** Mirror `src/` folder structure 1:1. Do not colocate test files next to source files.

## Validation Checklist
* [ ] App Router `page.tsx` files contain only component composition without inline business logic or data fetching.
* [ ] Components in `components/ui/` remain pure shadcn primitives free of business domain code.
* [ ] Feature folders do not cross-import directly from other feature folders.
* [ ] All tests are placed under `src/__tests__/` mirroring source structure.