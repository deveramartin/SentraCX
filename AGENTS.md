# AGENTS.md — SentraCX - Customer Experience & Relationship Management System

This file gives AI coding agents (Antigravity, Cursor, Copilot, etc.) the context needed to work
safely and consistently across this repository. Read this before generating or editing code,
and re-read the relevant section before touching a service you haven't worked in during this
session.

## 1. Project Overview

SentraCX is a Customer Relationship Management System composed of **three separate applications**
that communicate over HTTP APIs:

1. **CRM** (`apps/api-crm`) — .NET / C# (net10.0), core transactional system: customer profiles,
   campaigns, tickets, real-time support chat. System of record for all customer relationship
   data. PostgreSQL primary store.
2. **AI-Analytics** (`apps/api-ai-analytics`) — Python / FastAPI, companion microservice that
   consumes CRM data (via API) and produces predictions/insights: churn scoring, CLV, sentiment
   analysis, NBA recommendations, ticket intelligence, etc. Polyglot persistence
   (MongoDB + Redis; pgvector is planned but not yet implemented).
3. **Web** (`apps/web-crm`) — Next.js 16 frontend with React 19, calls both APIs. Source code
   lives under `apps/web-crm/src/`.

These are **independently deployable services**, not modules of one app. CRM does not import
AI-Analytics code or vice versa. All cross-service communication happens over REST APIs.

## 2. Tech Stack

| Service | Stack | Primary datastore |
|---|---|---|
| CRM backend | .NET 10 / C# (net10.0) | PostgreSQL (Npgsql + EF Core) |
| AI-Analytics backend | Python 3.12 / FastAPI | MongoDB + Redis |
| Frontend | Next.js 16 (App Router), React 19 | — (calls both APIs) |

- **Package manager**: `pnpm` (v9+) — the workspace uses `pnpm-workspace.yaml` and
  `turbo.json`. Always use `pnpm`, never `npm` or `yarn`, for monorepo-level commands.
- **UI library**: shadcn/ui (`new-york` style, `neutral` base color) — always use shadcn
  components as the base primitives. Don't hand-roll a component that shadcn already provides.
  Add new components with `npx shadcn@latest add <component>` from `apps/web-crm/`.
- **Styling**: Tailwind CSS v4 with CSS custom properties (OKLCH color space). The design
  token source of truth is `apps/web-crm/src/app/globals.css`. Never write arbitrary color
  values — always use the CSS variables defined there (e.g. `text-foreground`, `bg-background`,
  `text-muted-foreground`).
- **Typography**: Hanken Grotesk (sans) + Geist Mono (mono), loaded via `next/font/google`.
  Reference via `font-sans` / `font-mono` Tailwind utilities.
- **Icons**: lucide-react (v1.24+) — the only icon library used. Don't add another icon
  package.
- **Authentication**: NextAuth.js v5 (Beta) with an external OIDC provider (`authservice`).
  The CRM backend validates JWT Bearer tokens (authority configured via `JWT_AUTHORITY` env
  var). Auth bypass is currently active for local development in `src/auth.ts`.
- **LLM / AI inference**: Groq API (`llama-3.1-8b-instant`) via the `groq` Python SDK.
  The client lives at `app/lib/groq_client.py`. All AI features fall back to heuristics when
  the Groq API is unavailable.
- **Design reference**: `.design-ref/` — always check this folder before building any new UI.
  If no matching reference exists for what you're building, **ask before improvising** a new
  visual pattern rather than inventing one silently.
- Real-time chat (CRM) uses SignalR WebSockets, coordinated across instances via Redis Pub/Sub.

## 3. Data Architecture — Polyglot Persistence Rules

**Do not add a new database without a stated reason tied to access pattern.** Each store exists
to solve a specific problem:

### CRM (PostgreSQL — source of truth)
- Owns: User (mirrored from Auth), CustomerProfile, Campaign, CampaignSchedule,
  MarketingInteraction, Ticket, Message, OrderHistory (synced, read-only).
- Relational, transactional data. Single source of truth for customer/ticket/order state.
  AI-Analytics never writes here.
- EF Core manages all schema changes via migrations. Never hand-edit the DB or write raw SQL
  against the production schema.
- See `docs/architecture/crm-data-model.md`.

### CRM (Redis — real-time transport, NOT persistence)
- Purpose: SignalR/WebSocket message fan-out across server instances, staff presence, unread
  counters, connection registry, typing indicators.
- **Rule**: every chat message is written to PostgreSQL AND published to Redis. Never Redis-only.
- Key patterns: `ticket:{ticketId}:messages` (pub/sub), `presence:staff:online` (Set),
  `unread:{userId}` (Hash), `ws:connections:{userId}` (Hash),
  `typing:{ticketId}:{userId}` (String, short TTL).

### AI-Analytics (MongoDB)
- Purpose: flexible/semi-structured data — raw conversation transcripts, customer feature log
  snapshots for ML model training (churn, CLV), campaign content variations.
- Collections: `CustomerFeatureLogs`, `CampaignVariations`, `ConversationTranscripts`.
- Do not put relational/transactional CRM data here.

### AI-Analytics (Redis)
- Purpose: caching expensive ML inference results (churn score, CLV, next-best-action, ticket
  analysis) with TTL-based auto-expiry.
- Key patterns: `customer:{id}:churn_score`, `customer:{id}:next_action`,
  `ticket:{id}:sentiment_stream` (Sorted Set), `ticket:{id}:analysis`.
- Different justification than CRM's Redis usage (computation cache vs. real-time transport) —
  don't conflate the two when documenting or defending design decisions.

### AI-Analytics (Vector store — planned, not yet implemented)
- Purpose: embeddings for Natural Language Query, semantic search over tickets/conversations,
  Smart Reply / Intent Detection matching.
- Planned technology: `pgvector` on a dedicated PostgreSQL instance.
- Every vector must carry metadata (source id, module, customer id, timestamp) for filtering.
- The `repositories/vector/` folder is reserved for this future implementation.

**When in doubt about which store new data belongs in**: (a) transactional/relational →
PostgreSQL, (b) flexible document-shaped ML input → MongoDB, (c) ephemeral/low-latency/computed
→ Redis, (d) embedding/similarity search → vector store. If it doesn't clearly fit, flag it
instead of guessing.

## 4. Cross-Service Communication

- CRM never queries AI-Analytics' databases directly, and AI-Analytics never queries CRM's
  PostgreSQL directly. All access is via each service's REST API.
- AI-Analytics calls the CRM API via `app/lib/crm_client.py` (async `httpx` client). It stores
  only references (IDs) back to CRM records, never duplicates ownership of that data.
- CRM calls AI-Analytics for insights (churn, CLV, NBA) when rendering customer detail pages.
- Document any new sync mechanism (webhook, scheduled pull, etc.) in `docs/architecture/`
  rather than implying it implicitly in code.

## 5. Git Instructions

- **Commit after every completed task.** Don't batch multiple unrelated tasks into one commit,
  and don't leave a completed task uncommitted while starting the next one.
- Use **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`,
  `style:`. Scope to the service when relevant, e.g. `feat(crm): add campaign recurrence field`,
  `fix(web): correct ticket status label mapping`.
- Each commit should represent **one concern** — matching the one-responsibility-per-file rule
  below. If a task touched multiple unrelated concerns, split into multiple commits.
- Never commit build artifacts or generated output: `bin/`, `obj/`, `__pycache__/`, `.next/`,
  `node_modules/`, `*.pdb`, `.venv/`. Confirm `.gitignore` covers these before committing
  from a fresh service folder.
- Branch naming: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`,
  `docs/<short-desc>`.
- Never commit directly to `main`. Work happens on a branch, merged via PR.

## 6. PR Instructions

- PR title follows the same Conventional Commit style as commits, e.g.
  `feat(ai-analytics): add churn score caching layer`.
- PR description must include:
  - **What changed** (short summary)
  - **Why** (link the plan doc in `docs/plans/implementations/` if one exists for this work)
  - **How it was tested**
  - **Schema/architecture impact** — if any data model changed, link the updated doc in
    `docs/architecture/` and confirm the Mermaid diagram was updated in the same PR.
- Keep PRs scoped to one feature or fix. If a PR is touching CRM, AI-Analytics, and Web all at
  once for unrelated reasons, split it.
- Do not open a PR with a file that violates the 200-line rule or mixes concerns — fix it before
  requesting review, don't leave a note to "clean up later."

## 7. Development Instructions

> Verify commands against actual `.csproj` / `pyproject.toml` / `package.json` scripts before
> treating as final.

### Running all services (from monorepo root)

```bash
pnpm dev          # Starts all three services in parallel via Turborepo
pnpm dev:web      # web-crm only (Next.js, port 3005)
pnpm dev:api      # api-crm only (.NET, port 5005)
pnpm dev:ai       # api-ai-analytics only (FastAPI, port 4005)
```

### CRM (.NET)

- Run: `dotnet watch run --urls https://localhost:5005` from `apps/api-crm`.
- Config: `appsettings.json` / `appsettings.Development.json` + env vars in `.env`.
- Database: PostgreSQL. Run EF Core migrations on startup (handled automatically in dev mode).
  For manual migration management: `pnpm migrate` (wraps `scripts/migrate-crm.sh`).
- API docs (development): https://localhost:5005/docs (Scalar UI).

### AI-Analytics (FastAPI)

- Run: `uvicorn app.main:app --reload --port 4005` from `apps/api-ai-analytics` (inside
  the `.venv`). Or `pnpm dev:ai` from the monorepo root.
- Requires MongoDB (port 27017) and Redis (port 6379) to be running first.
- Config: `app/core/config.py` (Pydantic Settings) + env vars from `.env.local`.
- API docs (development): http://localhost:4005/docs (Scalar UI).

### Web (Next.js)

- Run: `pnpm dev` from `apps/web-crm` or `pnpm dev:web` from monorepo root.
- Runs on https://localhost:3005 (HTTPS with self-signed cert via `--experimental-https`).
- TypeScript required — no `.js`/`.jsx` files in `src/app/` or `src/components/`.
- Build verification runs in CI via GitHub Actions (`.github/workflows/ci.yml`).
- Environment variables: never commit `.env` / `.env.local` files with real secrets. Use
  `.env.example` per service documenting required keys.

## 8. Testing Instructions

- **CRM**: `apps/api-crm/tests/Crm.Api.Tests` mirrors the source folder structure 1:1
  (`Controllers/`, `Services/`, `Helpers/`, `Hubs/`, etc.). One test class per class under
  test. Run with: `dotnet test` from `apps/api-crm` or `pnpm test:api` from root.
- **AI-Analytics**: `apps/api-ai-analytics/tests/` mirrors `app/` structure 1:1. One test
  module per module under test (e.g. `tests/services/test_customer_insights_service.py`
  for `app/services/customer_insights_service.py`). Run with:
  `python -m pytest tests/ -v` (inside `.venv`) or `pnpm test:ai` from root.
- **Web**: Tests live in `src/__tests__/`, mirroring `src/` structure (e.g.
  `src/__tests__/hooks/useCustomers.test.ts`, `src/__tests__/components/features/customers/`).
  Run with: `pnpm test` from `apps/web-crm` or `pnpm test:web` from root (if defined).
- Run the relevant service's test suite before committing any change to that service.
- New business logic (services, hooks, repositories) requires a corresponding test in the same
  PR — don't defer test-writing to a follow-up task.

## 9. Planning Workflow

When asked to produce a plan for a feature or change:

1. **Ask first.** If anything about the requirement, data shape, affected service(s), or
   design/UX reference is unclear or unconfirmed, ask the user before generating the plan.
   Don't fill gaps with silent assumptions for anything that would change the plan's shape.
2. Once confirmed, write the plan to `docs/plans/implementations/<feature-name>.md`.
3. The plan should reference which service(s) it touches, which files/folders are expected to
   be created or modified, and any data model or architecture doc that needs updating alongside
   the implementation.

## 10. Bug Fix Reports

Every non-trivial bug fix gets a short report saved to
`docs/fix-reports/<short-bug-description>.md`, containing:
- What was broken (symptom)
- Root cause
- The fix (files touched)
- How it was verified

## 11. Implementation Reports

After completing a significant feature implementation, save a report to
`docs/implementation-reports/<feature-name>.md`, containing:
- What was built
- Key architectural decisions made
- Files created or modified
- How it was tested

## 12. Global File & Folder Conventions (all services)

These rules are strict and apply everywhere in the monorepo:

- **One concern per file.** A file does exactly one thing — one component, one hook, one
  service class, one repository, one route module. If a file is doing two things, split it.
- **~200 line hard cap per file.** This is strict, not a soft guideline. If a file is
  approaching the limit, that's a signal to extract a sub-component, helper, or separate
  concern — not to keep writing.
- **New folders are allowed** any time a genuinely new, decoupled concern emerges — as long as
  that folder isn't tightly coupled to or reaching into unrelated existing folders/files. A new
  folder should own its own concern, not become a shared dumping ground.
- **No cross-feature reaching.** Code in one feature area shouldn't directly import another
  feature's internals. Shared logic goes into an explicit shared/common location.
- Naming, casing, and file organization within each service follow that service's section
  below — don't mix conventions across services (e.g., don't use PascalCase files in the
  Next.js app because CRM uses it).

## 13. Next.js App Structure (Web)

App root: `apps/web-crm/src/`. This structure is **strict**. Do not deviate without flagging
it first.

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

### Hard rules for this structure

- **Pages only render components. No logic.** A `page.tsx` file's job is composition only:
  ```tsx
  export default function CustomersPage() {
    return <CustomerProfiles />
  }
  ```
  Data fetching, state, and business logic live in the component (or the hooks/lib it calls),
  never inline in the page file.

- **No `containers/` folder, and no wrapping-everything-in-Context pattern.** Prefer, in this
  order: local component state → a custom hook → a lightweight store (if truly cross-cutting)
  before reaching for a new React Context provider. Context should be reserved for genuinely
  global concerns (auth session, theme) — not feature-level state.

- **shadcn/ui components stay in `components/ui/`** as generated/base primitives. Compose them
  inside feature components — don't add business logic or data-fetching into a `ui/` file.
  Add new shadcn components with: `npx shadcn@latest add <component>` from `apps/web-crm/`.

- **lucide-react is the only icon source.** Don't add another icon library, don't inline SVGs
  for icons that lucide already provides.

- **Feature folders are isolated.** `components/features/tickets/` should not import from
  `components/features/campaigns/` directly. If two features need the same piece, promote it to
  `components/shared/` or `lib/`.

- **Tailwind v4 & CSS variables.** All color values come from the design tokens in
  `globals.css` (OKLCH-based custom properties). Never hardcode color values — always use
  Tailwind utility classes that map to these variables. The `tailwind.config.ts` extends the
  theme with font families and spacing tokens.

- **Tests in `src/__tests__/`.** Mirror the `src/` folder structure 1:1 under `src/__tests__/`
  (e.g., `src/__tests__/hooks/useCustomers.test.ts` for `src/hooks/useCustomers.ts`). Do not
  colocate test files next to source files using `.test.tsx` suffixes.

## 14. CRM (.NET) Project Structure

Current structure (`apps/api-crm`):

```
apps/api-crm/
├── Configurations/         → Options classes (bound from appsettings)
├── Constants/              → App-wide constants
├── Controllers/            → API endpoints
│   ├── CustomersController.cs
│   ├── TicketsController.cs
│   ├── MessagesController.cs
│   ├── MarketingInteractionsController.cs
│   ├── OrdersController.cs
│   └── WebhooksController.cs
├── Data/
│   ├── AppDbContext.cs
│   ├── Migrations/         → EF Core generated migrations only
│   └── Seed/               → Seed data scripts
├── DTOs/
│   ├── Requests/           → Incoming request shapes
│   └── Responses/          → Outgoing response shapes
├── Exceptions/             → Custom exception types
├── Extensions/             → Service collection extensions
├── Filters/                → Action/exception filters
├── Helpers/                → Utility classes (e.g. EnvLoader)
├── Hubs/
│   └── ChatHub.cs          → SignalR real-time chat hub
├── Interfaces/
│   ├── Repositories/       → ICustomerProfileRepository, ITicketRepository, etc.
│   └── Services/           → ICustomerService, ITicketService, etc.
├── Mappers/                → Entity ↔ DTO mapping only
├── Middleware/             → Custom middleware (e.g. JitProvisioningMiddleware)
├── Models/                 → EF Core entities (mirrors crm-data-model.md)
│   ├── CustomerProfile.cs
│   ├── Ticket.cs
│   ├── Message.cs
│   ├── Campaign.cs (planned)
│   ├── MarketingInteraction.cs
│   ├── OrderHistory.cs
│   └── User.cs
├── Repositories/           → Data access layer (implements Interfaces/Repositories/)
├── Services/               → Business logic (implements Interfaces/Services/)
├── Validators/             → FluentValidation validators
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── Crm.Api.csproj
└── tests/Crm.Api.Tests/
    ├── Controllers/
    ├── Helpers/
    ├── Hubs/
    └── Services/
```

### Strict layering rules

- **Controllers**: HTTP concerns only — routing, request binding, status codes. Delegate all
  logic to `Services/`. A controller must never query `AppDbContext` directly and must never
  contain business rules.
- **Services**: business logic layer. One service per domain aggregate (`CustomerService`,
  `TicketService`, `MessageService`, etc.). Implements a corresponding interface in
  `Interfaces/Services/`. Calls `Repositories/` for data access. No HTTP-specific code.
- **Repositories**: data access only, one repository per entity/aggregate. Implements a
  corresponding interface in `Interfaces/Repositories/`. No business logic.
- **Interfaces/**: one interface file per service or repository. All services and repositories
  are registered against their interface in `Program.cs`.
- **Hubs/**: SignalR hub classes only. `ChatHub.cs` handles real-time WebSocket connections
  for the ticket chat feature.
- **DTOs/Requests** and **DTOs/Responses**: one DTO per shape. Don't reuse a DTO across
  unrelated endpoints just to avoid creating a new file.
- **Mappers**: entity ↔ DTO mapping only. No business logic, no validation.
- **Validators**: one FluentValidation validator per request DTO.
- **Models**: EF Core entities only, must mirror `docs/architecture/crm-data-model.md`. No
  business logic or persistence side-effects in entity classes.
- **Middleware / Filters / Extensions / Helpers**: cross-cutting utilities only, kept small and
  single-purpose.
- **Data/Migrations**: EF Core generated migrations only — never hand-edited.
- **tests/**: mirrors the source tree 1:1 — a new `Services/TicketService.cs` requires a
  matching `tests/Crm.Api.Tests/Services/TicketServiceTests.cs`.
- New top-level folders are allowed for genuinely new cross-cutting concerns (e.g. a future
  `BackgroundJobs/` folder), but must not blur the Controller → Service → Repository layering.

## 15. AI-Analytics (FastAPI) Project Structure

Current structure (`apps/api-ai-analytics`):

```
apps/api-ai-analytics/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── deps.py                            → Dependency injection wiring
│   │       └── routes/
│   │           ├── customers.py                   → churn, CLV, segmentation, NBA endpoints
│   │           └── tickets.py                     → sentiment, analysis endpoints
│   ├── core/
│   │   └── config.py                              → Pydantic Settings (env vars)
│   ├── db/
│   │   ├── mongo.py                               → Motor async client lifecycle ONLY
│   │   └── redis.py                               → Redis async client lifecycle ONLY
│   ├── lib/
│   │   ├── crm_client.py                          → Async httpx client for CRM API
│   │   └── groq_client.py                         → Groq API client (LLM inference)
│   ├── ml/
│   │   ├── churn_model.py                         → Churn risk scoring (0.0–1.0)
│   │   ├── clv_model.py                           → Customer Lifetime Value prediction
│   │   ├── nba_model.py                           → Next-Best-Action recommendation
│   │   └── ticket_analyzer.py                     → Sentiment, category, urgency analysis
│   ├── repositories/
│   │   ├── mongo/
│   │   │   ├── conversation_transcript_repository.py
│   │   │   └── customer_feature_repository.py
│   │   ├── redis/
│   │   │   ├── customer_cache_repository.py
│   │   │   └── ticket_sentiment_repository.py
│   │   └── vector/                                → Reserved for future pgvector implementation
│   ├── services/
│   │   ├── customer_insights_service.py
│   │   └── ticket_analysis_service.py
│   ├── schemas/
│   │   ├── customer_schemas.py
│   │   └── ticket_schemas.py
│   ├── models/                                    → Internal data models (Mongo document shapes)
│   ├── mappers/                                   → Schema ↔ model mapping only
│   ├── exceptions/                                → Custom exceptions
│   ├── helpers/                                   → Utility functions
│   └── main.py                                    → FastAPI app + lifespan (DB connections)
├── tests/                                         → Mirrors app/ structure 1:1
│   ├── api/v1/
│   ├── lib/
│   ├── ml/
│   ├── repositories/
│   │   ├── mongo/
│   │   └── redis/
│   ├── schemas/
│   └── services/
├── pyproject.toml
├── .env.example
└── .env.local                                     → Local config (gitignored)
```

### Strict layering rules

- **Routes**: request/response handling only. Call `services/`, never call `db/` or
  `repositories/` directly, never call `ml/` directly.
- **Services**: orchestration and business logic. Compose one or more repositories and/or
  `ml/` inference calls. No FastAPI-specific request/response objects — pure Python in,
  Pydantic schema or plain object out.
- **Repositories**: one repository per store + entity. A repository only ever talks to one
  store. No cross-store logic inside a repository — that belongs in a service.
- **db/**: connection/client lifecycle only — no queries live here.
- **lib/**: external API clients only (`crm_client.py`, `groq_client.py`). No business logic.
- **ml/**: model loading and heuristic inference only. No persistence logic, no route logic.
  Services call into `ml/` when a prediction is needed, then hand the result to a repository
  to cache/store. Groq API is used for LLM-powered analysis; all ML modules include
  heuristic fallbacks.
- **schemas/**: one Pydantic schema file per resource — request and response models can share
  a file only if they describe the same resource.
- **models/**: internal representations (Mongo document shapes), not API-facing.
- **mappers/**: schema ↔ model conversion only.
- **tests/**: mirrors `app/` 1:1 — `app/services/customer_insights_service.py` requires
  `tests/services/test_customer_insights_service.py`.
- New folders are allowed for genuinely new concerns (e.g. a future `tasks/` folder for
  background jobs) as long as the store-per-repository and route→service→repository layering
  isn't blurred.

## 16. What Agents Should NOT Do

- Don't add a new database or storage technology without documenting the workload-based reason
  in `docs/architecture/`.
- Don't let Redis become a source of truth for anything durable (chat messages, scores that
  can't be recomputed, etc.).
- Don't have CRM and AI-Analytics import each other's code or share a database connection.
- Don't invent API endpoints, folder paths, or config values not confirmed in this file or the
  actual codebase — flag the gap instead of guessing silently.
- Don't modify `docs/architecture/*.md` schema docs without updating the corresponding Mermaid
  diagrams in the same file/PR.
- Don't exceed ~200 lines per file, don't mix concerns in one file, don't create a `containers/`
  layer in the Next.js app, don't put logic in a `page.tsx` beyond composing components.
- Don't generate a plan without first asking about anything unclear — silent assumptions on
  unclear requirements are not acceptable at planning time.
- Don't skip committing after a completed task, and don't bundle unrelated tasks into one
  commit.
- Don't use `npm` or `yarn` in the monorepo — always use `pnpm`.
- Don't hardcode color values in web components — always use Tailwind utilities that reference
  the CSS custom properties defined in `globals.css`.
- Don't add a new icon library — lucide-react is the only icon source.
- Don't hand-roll a UI primitive that shadcn/ui already provides.

## 17. Key Reference Docs

- `docs/architecture/crm-data-model.md` — CRM schema, ER diagram, WebSocket+Redis flow
- `docs/architecture/ai-analytics-data-model.md` — AI-Analytics schema, ER diagram
- `docs/api/api-crm.md` — CRM API endpoint reference
- `docs/api/api-ai-analytics.md` — AI-Analytics API endpoint reference
- `docs/plans/implementations/` — feature plans (one file per feature)
- `docs/fix-reports/` — bug fix reports (one file per bug)
- `docs/implementation-reports/` — implementation summaries (one file per feature)
- `.design-ref/` — UI/design reference material
- `apps/api-crm/README.md` — CRM service quick-start
- `apps/api-ai-analytics/README.md` — AI-Analytics service quick-start