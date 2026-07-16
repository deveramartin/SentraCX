# AGENTS.md — SentraCX - Customer Experience & Relationship Management System

This file gives AI coding agents (Antigravity, Cursor, Copilot, etc.) the context needed to work
safely and consistently across this repository. Read this before generating or editing code,
and re-read the relevant section before touching a service you haven't worked in during this
session.

## 1. Project Overview

SentraCX is a Customer Relationship Management System composed of **two separate applications**
that communicate over HTTP APIs:

1. **CRM** (`apps/api-crm`) — .NET / C#, core transactional system: customer profiles,
   campaigns, tickets, real-time support chat. System of record for all customer relationship
   data. PostgreSQL primary store.
2. **AI-Analytics** (`apps/api-ai-analytics`) — Python / FastAPI, companion microservice that
   consumes CRM data (via API) and produces predictions/insights: churn scoring, CLV, sentiment
   analysis, NBA recommendations, campaign forecasting, NLQ search, etc. Polyglot persistence
   (MongoDB + Redis + vector store).
3. **Web** (`apps/web` or `/web`) — Next.js frontend, calls both APIs.

These are **independently deployable services**, not modules of one app. CRM does not import
AI-Analytics code or vice versa. All cross-service communication happens over REST APIs.

## 2. Tech Stack

| Service | Stack | Primary datastore |
|---|---|---|
| CRM backend | .NET / C# (net10.0) | PostgreSQL (Npgsql + EF Core) |
| AI-Analytics backend | Python / FastAPI | MongoDB + Redis + Vector store |
| Frontend | Next.js (App Router) | — (calls both APIs) |

- **UI library**: shadcn/ui — always use shadcn components as the base primitives; don't
  hand-roll a component that shadcn already provides.
- **Icons**: lucide-react — the only icon library used. Don't add another icon package.
- **Design reference**: `.design-ref/` — always check this folder before building any new UI.
  If no matching reference exists for what you're building, **ask before improvising** a new
  visual pattern rather than inventing one silently.
- Real-time chat (CRM) uses WebSockets, coordinated across instances via Redis Pub/Sub.

## 3. Data Architecture — Polyglot Persistence Rules

**Do not add a new database without a stated reason tied to access pattern.** Each store exists
to solve a specific problem:

### CRM (PostgreSQL — source of truth)
- Owns: User (mirrored from Auth), CustomerProfile, Campaign, MarketingInteraction, Ticket,
  Message, OrderHistory (synced, read-only).
- Relational, transactional data. Single source of truth for customer/ticket/order state.
  AI-Analytics never writes here.
- See `docs/architecture/crm-data-model.md`.

### CRM (Redis — real-time transport, NOT persistence)
- Purpose: WebSocket message fan-out across server instances, staff presence, unread counters,
  connection registry, typing indicators.
- **Rule**: every chat message is written to Postgres AND published to Redis. Never Redis-only.
- Key patterns: `ticket:{ticketId}:messages` (pub/sub), `presence:staff`, `unread:{userId}`,
  `ws:connections:{userId}`, `typing:{ticketId}:{userId}` (short TTL).

### AI-Analytics (MongoDB)
- Purpose: flexible/semi-structured data — raw conversation transcripts, ticket content
  snapshots for model input, campaign content variations, denormalized behavior logs used as
  ML features.
- Do not put relational/transactional CRM data here.

### AI-Analytics (Redis)
- Purpose: caching expensive ML inference results (churn score, CLV, next-best-action).
- Different justification than CRM's Redis usage (computation cache vs. real-time transport) —
  don't conflate the two when documenting or defending design decisions.

### AI-Analytics (Vector store)
- Purpose: embeddings for Natural Language Query, semantic search over tickets/conversations,
  Smart Reply / Intent Detection matching.
- Every vector must carry metadata (source id, module, customer id, timestamp) for filtering.

**When in doubt about which store new data belongs in**: (a) transactional/relational →
Postgres, (b) flexible document-shaped ML input → MongoDB, (c) ephemeral/low-latency/computed →
Redis, (d) embedding/similarity search → vector store. If it doesn't clearly fit, flag it
instead of guessing.

## 4. Cross-Service Communication

- CRM never queries AI-Analytics' databases directly, and AI-Analytics never queries CRM's
  Postgres directly. All access is via each service's REST API.
- AI-Analytics treats CRM as the source of truth for customer/ticket/order identity. It stores
  only references (IDs) back to CRM records, never duplicates ownership of that data.
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
  `node_modules/`, `*.pdb`. Confirm `.gitignore` covers these before committing from a fresh
  service folder.
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

> Commands below reflect the stated stack; verify against actual `.csproj` / `pyproject.toml` /
> `package.json` scripts before treating as final, and correct this section if they differ.

- **CRM (.NET)**: run via `dotnet run` from `apps/api-crm`. EF Core migrations for all schema
  changes — never hand-edit the database or write manual SQL against production schema.
  Config via `appsettings.json` / `appsettings.Development.json`.
- **AI-Analytics (FastAPI)**: run via `uvicorn app.main:app --reload` from
  `apps/api-ai-analytics`. Async endpoints by default. Config via `core/config.py` +
  environment variables, not hardcoded values.
- **Web (Next.js)**: run via `npm run dev` (or `pnpm dev`, confirm which package manager the
  lockfile indicates). TypeScript required, no `.js`/`.jsx` files in `app/` or `components/`.
- Each service has its own `Dockerfile` — don't introduce cross-service build dependencies.
- Environment variables: never commit `.env` files with real secrets. Use `.env.example` per
  service documenting required keys.

## 8. Testing Instructions

- **CRM**: `tests/Crm.Api.Tests` mirrors the source folder structure 1:1 (`Controllers/`,
  `Services/`, `Helpers/`, etc.). One test class per class under test.
- **AI-Analytics**: `tests/` mirrors `app/` structure 1:1. One test module per module under
  test (e.g. `tests/services/test_churn_service.py` for `app/services/churn_service.py`).
- **Web**: colocate tests next to the file they cover using a `.test.tsx` / `.test.ts` suffix
  (e.g. `CustomerCard.tsx` + `CustomerCard.test.tsx` in the same folder). Don't create a
  separate parallel `__tests__` tree that duplicates the component tree.
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

## 11. Global File & Folder Conventions (all services)

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

## 12. Next.js App Structure (Web)

This structure is **strict**. Do not deviate without flagging it first.

```
web/
├── .design-ref/                    → design reference material; check before building any UI
├── app/                            → App Router routes — PAGES ONLY, no logic
│   ├── (customers)/
│   │   └── customers/[id]/page.tsx
│   ├── (tickets)/tickets/page.tsx
│   ├── (campaigns)/campaigns/page.tsx
│   ├── (conversations)/conversations/[ticketId]/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         → shadcn/ui primitives only — no business logic here
│   ├── shared/                     → cross-feature reusable components (Navbar, Footer, EmptyState)
│   └── features/
│       ├── customers/              → CustomerCard.tsx, CustomerList.tsx, CustomerStatusBadge.tsx
│       ├── tickets/
│       ├── campaigns/
│       └── conversations/
├── hooks/                          → one custom hook per file (useChurnScore.ts, useTicketSocket.ts)
├── lib/
│   ├── api/                        → API client modules — crm-client.ts, ai-analytics-client.ts
│   ├── utils/                      → pure utility functions, no side effects
│   └── validators/                 → zod schemas / form validation
├── types/                          → shared TypeScript types/interfaces
├── constants/
└── public/
```

### Hard rules for this structure

- **Pages only render components. No logic.** A `page.tsx` file's job is composition, nothing
  else:
  ```tsx
  export default function CustomerDetailPage() {
    return (
      <CustomerDetail />
    )
  }
  ```
  Data fetching, state, and business logic live in the component (or the hooks/lib it calls),
  never inline in the page file. If a page needs route params, pass them straight into the
  component as props — don't process them in the page.

- **No `containers/` folder, and no wrapping-everything-in-Context pattern.** Don't introduce a
  containers layer that exists purely to hold state and wrap a "dumb" presentational component.
  Prefer, in this order: local component state → a custom hook → a lightweight store (if truly
  cross-cutting) before reaching for a new React Context provider. Context should be reserved
  for genuinely global concerns (auth session, theme) — not feature-level state.

- **shadcn/ui components stay in `components/ui/`** as generated/base primitives. Compose them
  inside feature components — don't add business logic or data-fetching into a `ui/` file.

- **lucide-react is the only icon source.** Don't add another icon library, don't inline SVGs
  for icons that lucide already provides.

- **Feature folders are isolated.** `components/features/tickets/` should not import from
  `components/features/campaigns/` directly. If two features need the same piece, promote it to
  `components/shared/` or `lib/`.

- **New folders are fine** (e.g. `components/features/campaigns/schedule/` for recurrence UI)
  as long as they own a distinct concern and don't reach into unrelated folders.

## 13. CRM (.NET) Project Structure

Current structure (`apps/api-crm`):

```
api-crm/
├── Configurations/
├── Constants/
├── Controllers/
├── Data/
│   ├── AppDbContext.cs
│   ├── Migrations/
│   └── Seed/
├── DTOs/
│   ├── Requests/
│   └── Responses/
├── Exceptions/
├── Extensions/
├── Filters/
├── Helpers/
├── Mappers/
├── Middleware/
├── Models/
├── Repositories/
├── Services/
├── Validators/
├── Program.cs
└── tests/Crm.Api.Tests/
    ├── Controllers/
    ├── Helpers/
    └── Services/
```

### Strict layering rules

- **Controllers**: HTTP concerns only — routing, request binding, status codes. Delegate all
  logic to `Services/`. A controller must never query `AppDbContext` directly and must never
  contain business rules.
- **Services**: business logic layer. One service per domain aggregate (`CustomerService`,
  `TicketService`, `CampaignService`, `MessageService`, etc.). Calls `Repositories/` for data
  access. No HTTP-specific code (no `HttpContext`, no status codes) belongs here.
- **Repositories**: data access only, one repository per entity/aggregate. No business logic —
  a repository fetches/persists, it doesn't decide.
- **DTOs/Requests** and **DTOs/Responses**: one DTO per shape. Don't reuse a DTO across
  unrelated endpoints just to avoid creating a new file.
- **Mappers**: entity ↔ DTO mapping only. No business logic, no validation.
- **Validators**: one validator per request DTO.
- **Models**: EF Core entities only, must mirror `docs/architecture/crm-data-model.md`. No
  business logic or persistence side-effects in entity classes.
- **Middleware / Filters / Extensions / Helpers**: cross-cutting utilities only, kept small and
  single-purpose. If a "helper" grows business rules, it belongs in `Services/` instead.
- **Exceptions**: one custom exception type per file (tightly related exceptions may share a
  file only if trivial).
- **Data/Migrations**: EF Core generated migrations only — never hand-edited.
- **Data/Seed**: seed data scripts only.
- **tests/**: mirrors the source tree 1:1 — a new `Services/CampaignService.cs` requires a
  matching `tests/Crm.Api.Tests/Services/CampaignServiceTests.cs`.
- New top-level folders are allowed for genuinely new cross-cutting concerns (e.g. a future
  `BackgroundJobs/` folder), but must not blur the Controller → Service → Repository layering.

## 14. AI-Analytics (FastAPI) Project Structure

Current structure, with additions needed for the polyglot data layer and ML inference. New
folders are marked **(new)**:

```
api-ai-analytics/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── deps.py
│   │       └── routes/
│   │           ├── customers.py          → churn, CLV, segmentation, NBA endpoints
│   │           ├── campaigns.py          → scoring, send-time, performance prediction
│   │           ├── tickets.py            → sentiment, categorization, priority, forecasting
│   │           ├── conversations.py      → real-time sentiment, summarization, smart reply
│   │           └── dashboard.py          → unified analytics, anomaly detection, NLQ
│   ├── core/                              → config/settings, startup/shutdown, logging
│   ├── db/
│   │   ├── mongo.py                       → Mongo client/connection setup ONLY
│   │   ├── redis.py                       → Redis client/connection setup ONLY
│   │   └── vector.py                      → vector store client/connection setup ONLY
│   ├── repositories/                      (new) → data access, one repo per store+entity
│   │   ├── mongo/
│   │   ├── redis/
│   │   └── vector/
│   ├── ml/                                (new) → model loading + inference wrappers only
│   ├── services/                          → business logic/orchestration, one file per feature
│   ├── schemas/                           → Pydantic request/response schemas, one per resource
│   ├── models/                            → Mongo document models / internal data models
│   ├── mappers/                           → schema ↔ model mapping only
│   ├── exceptions/
│   ├── helpers/
│   └── main.py
└── tests/                                 → mirrors app/ structure 1:1
```

### Strict layering rules

- **Routes**: request/response handling only. Call `services/`, never call `db/` or
  `repositories/` directly, never call `ml/` directly.
- **Services**: orchestration and business logic. A service composes one or more repositories
  and/or `ml/` inference calls. No FastAPI-specific request/response objects here — pure
  Python in, Pydantic schema or plain object out.
- **Repositories**: one repository per store + entity (e.g.
  `repositories/mongo/conversation_repository.py`,
  `repositories/redis/score_cache_repository.py`,
  `repositories/vector/ticket_embedding_repository.py`). A repository only ever talks to one
  store. No cross-store logic inside a repository — that belongs in a service.
- **db/**: connection/client setup only — no queries live here.
- **ml/**: model loading and inference only (e.g. `ml/churn_model.py`,
  `ml/sentiment_model.py`). No persistence logic, no route logic. Services call into `ml/`
  when a prediction is needed, then hand the result to a repository to cache/store.
- **schemas/**: one Pydantic schema file per resource (`ticket_schemas.py`,
  `customer_schemas.py`, etc.) — request and response models can share a file only if they
  describe the same resource.
- **models/**: internal representations (e.g. Mongo document shapes), not API-facing.
- **mappers/**: schema ↔ model conversion only.
- **tests/**: mirrors `app/` 1:1 — `app/services/churn_service.py` requires
  `tests/services/test_churn_service.py`.
- New folders are allowed for genuinely new concerns (e.g. a future `tasks/` folder for
  background jobs) as long as the store-per-repository and route→service→repository layering
  isn't blurred.

## 15. What Agents Should NOT Do

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

## 16. Key Reference Docs

- `docs/architecture/crm-data-model.md` — CRM schema, ER diagram, WebSocket+Redis flow
- `docs/architecture/ai-analytics-data-model.md` — AI-Analytics schema, ER diagram
- `docs/plans/implementations/` — feature plans (one file per feature)
- `docs/fix-reports/` — bug fix reports (one file per bug)
- `.design-ref/` — UI/design reference material