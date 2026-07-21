# Sprint 2 — CRM-002/003/004/005/006: Campaigns, Promotions & Tickets

## Scope

Implement all Sprint 2 backlog items from `docs/fe-backlogs.md` and `docs/be-backlogs.md`:

| Ticket | Feature | Type |
|---|---|---|
| CRM-002 | Campaigns module (3-tab UI + create form + draft/history) | BE + FE |
| CRM-003 | Promotions module (4-tab UI + create/edit/cancel) | BE + FE |
| CRM-004 | Campaign–Promotion linking (multi-select picker in campaign form) | BE + FE |
| CRM-005 | Tickets — Staff/Manager view, real API, tabs + claim/unclaim | FE only |
| CRM-006 | Tickets — Customer view, real API, create + cancel | FE only |

Constraints: **mobile-responsive** throughout, **shadcn/ui** for all UI primitives, one
git commit per completed task.

---

## Current State Audit

### Backend (`apps/api-crm`)

| Layer | Exists? | Notes |
|---|---|---|
| `Models/Campaign.cs` + `Models/CampaignSchedule.cs` | ✅ | Complete |
| `Data/Configurations/CampaignConfiguration.cs` | ✅ | Complete |
| EF Migration `AddCampaignsAndSchedules` | ✅ | Applied |
| `Models/Promotion.cs` | ❌ | Must create |
| `Models/CampaignPromotion.cs` (join table) | ❌ | Must create |
| `Interfaces/Repositories/ICampaignRepository.cs` | ❌ | Must create |
| `Repositories/CampaignRepository.cs` | ❌ | Must create |
| `Interfaces/Services/ICampaignService.cs` | ❌ | Must create |
| `Services/CampaignService.cs` | ❌ | Must create |
| `Controllers/CampaignsController.cs` | ❌ | Must create |
| `Controllers/PromotionsController.cs` | ❌ | Must create |
| `Controllers/UploadController.cs` | ❌ | Must create |
| `Services/FileStorageService.cs` | ❌ | Must create |
| `BackgroundJobs/CampaignStatusJob.cs` | ❌ | Must create |
| `BackgroundJobs/PromotionStatusJob.cs` | ❌ | Must create |
| Tickets BE | ✅ | Fully implemented, no changes needed |

### Frontend (`apps/web-crm`)

| Layer | Exists? | Notes |
|---|---|---|
| `types/campaign.ts` | ❌ | Must create (replaces local `types.ts`) |
| `types/promotion.ts` | ❌ | Must create |
| `types/ticket.ts` | ❌ | Must create (replaces local `types.ts`) |
| `lib/api/crm-client.ts` (campaigns/promotions/tickets namespaces) | ❌ | Must extend |
| `hooks/useCampaigns.ts` + `useCampaign.ts` | ❌ | Must create |
| `hooks/usePromotions.ts` + `usePromotion.ts` | ❌ | Must create |
| `hooks/useTickets.ts` + `useTicket.ts` | ❌ | Must create |
| `components/features/campaigns/` | ⚠️ | Exists but mock-only, wrong types — must rebuild |
| `components/features/promotions/` | ❌ | New folder, must create |
| `components/features/tickets/` | ⚠️ | Exists but mock-only — must rewire to real API |
| `app/promotions/page.tsx` | ❌ | Must create |
| `app/tickets/customer/page.tsx` | ❌ | Must create |
| `components/shared/Sidebar.tsx` / `MobileNav.tsx` | ⚠️ | Must add Promotions nav link |

---

## Architecture Decisions

### 1. Campaign Channels

The data model currently stores `Channel` as a plain string with only `Email` and `InApp`
documented. Campaigns are for multi-channel marketing outreach including:

**`Email` | `InApp` | `Facebook` | `Twitter` | `Instagram`**

The `Campaign.Channel` column is already `HasMaxLength(50)` string — no migration is needed
for the column itself. However, the `Channel` field needs to change to support **multiple
channels per campaign** (e.g. one campaign posts to both Facebook and Instagram). This means
changing the data model:

**Decision**: Replace `Campaign.Channel: string` with `Campaign.Channels: List<string>` stored
as a PostgreSQL `text[]` array. This requires:
- Updating `Models/Campaign.cs`
- Updating `Data/Configurations/CampaignConfiguration.cs` (`HasColumnType("text[]")`)
- Creating a new EF migration `UpdateCampaignChannelToArray`
- Updating `docs/architecture/crm-data-model.md`

### 2. Template Storage

`Campaign` already has `TemplateId: string?`. A lightweight `Template` entity will be added
with its own CRUD so users can create/reuse HTML email templates. Stored in PostgreSQL — no
external template engine in this sprint.

**Template model**: `id`, `name`, `description?`, `contentHtml`, `thumbnailUrl?`, `channel`
(which channel(s) it applies to), `createdAt`.

The template picker in the campaign form will list available templates and set `templateId`.

### 3. File Storage (Image Upload)

Campaigns and Tickets both accept image attachments. A clean `IFileStorageService` abstraction
is introduced with two implementations:

- **`LocalFileStorageService`** — dev environment, stores under `wwwroot/uploads/`,
  returns a local URL. Zero configuration required.
- **`AwsS3FileStorageService`** — production, uploads to an S3 bucket. Configured via
  env vars: `FILE_STORAGE_PROVIDER=S3`, `AWS_S3_BUCKET`, `AWS_S3_REGION`,
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

The active implementation is selected in `Program.cs` based on `FILE_STORAGE_PROVIDER` env
var (defaults to `Local` in dev). A single `POST /api/v1/upload` endpoint accepts a
`multipart/form-data` file and returns `{ "url": "..." }`. The frontend submits this URL
as `imageUrl` on the campaign/ticket payload.

**NuGet**: `AWSSDK.S3` added to `Crm.Api.csproj` for the S3 implementation.

### 4. Background Jobs (Sprint 2 scope — confirmed)

Two `IHostedService` implementations check on a timer (every 5 minutes):

- **`CampaignStatusJob`**: Queries `Active` campaigns whose `CampaignSchedule.EndDate` has
  passed → sets `Status = "Ended"`.
- **`PromotionStatusJob`**: Queries `Active` promotions whose `EndDate` has passed → sets
  `Status = "Accomplished"`.

Both jobs live in a new `BackgroundJobs/` folder (acceptable as a new cross-cutting folder per
the structure skill). They are registered as `AddHostedService<T>()` in `Program.cs`.

### 5. Promotion Model

Not currently in the data model doc. The entity is:

| Field | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `title` | string, max 200, required | |
| `description` | text, required | |
| `promotionType` | string, max 50 | `Discount`, `Voucher`, `FreeShipping`, `BuyOneGetOne`, `Cashback` |
| `discountValue` | decimal? | required when type is `Discount` or `Cashback` |
| `voucherCode` | string?, max 100 | required when type is `Voucher` |
| `startDate` | DateTime? | |
| `endDate` | DateTime? | |
| `status` | string, max 50 | `Draft`, `Active`, `Cancelled`, `Accomplished` |
| `createdAt` | DateTime | db default `now()` |

Many-to-many with `Campaign` via `CampaignPromotion` join table:
- `CampaignPromotion.CampaignId` (FK, PK1)
- `CampaignPromotion.PromotionId` (FK, PK2)

### 6. Tickets Frontend Strategy

The tickets backend is fully implemented. The frontend Tickets module currently uses mock data
and has the wrong status taxonomy (`Open/In Progress/Resolved` vs the real `Unclaimed/Claimed/
Ongoing/Completed/Canceled`). The feature folder will be rebuilt around the real API.

Staff view and Customer view use different tab arrangements derived from the same DB `status`
field:

| DB Status | Staff Tab | Customer Tab |
|---|---|---|
| Unclaimed | Available | Pending |
| Claimed | Claimed | Pending |
| Ongoing | Claimed | Ongoing |
| Completed | Completed | Completed |
| Canceled | — | Cancelled |

Both views are implemented as separate components and mounted at different routes:
- Staff: `/tickets` → `Tickets.tsx`
- Customer: `/tickets/customer` → `TicketsCustomerView.tsx`

Role-based view switching (showing the right component per role) is deferred to Sprint 3's
RBAC work.

---

## Git Branch

```bash
git checkout feature/customer-profiles
git checkout -b feature/sprint2-campaigns-promotions-tickets
```

---

## Implementation Phases

### Phase 0 — Branch Setup

```bash
git checkout -b feature/sprint2-campaigns-promotions-tickets
```

**Commit**: *(branch creation, no code)*

---

### Phase 1 — Data Model: Promotion + CampaignPromotion + Channel Array + Template

**Services touched**: `apps/api-crm`

**Files created:**
- `Models/Promotion.cs`
- `Models/CampaignPromotion.cs`
- `Models/Template.cs`
- `Data/Configurations/PromotionConfiguration.cs`
- `Data/Configurations/CampaignPromotionConfiguration.cs`
- `Data/Configurations/TemplateConfiguration.cs`

**Files modified:**
- `Models/Campaign.cs` — `Channel: string` → `Channels: List<string>`, add nav props
- `Data/Configurations/CampaignConfiguration.cs` — `HasColumnType("text[]")` for Channels
- `Data/AppDbContext.cs` — add `DbSet<Promotion>`, `DbSet<CampaignPromotion>`, `DbSet<Template>`

**Migration:**
```bash
dotnet ef migrations add AddPromotionsTemplatesAndCampaignChannelArray \
  --project apps/api-crm --startup-project apps/api-crm
```

**Commit**: `feat(api-crm): add Promotion, Template, CampaignPromotion models and migration`

---

### Phase 2 — File Storage Service

**Services touched**: `apps/api-crm`

**Files created:**
- `Interfaces/IFileStorageService.cs` — `UploadAsync(IFormFile file, string folder) -> Task<string>`
- `Services/LocalFileStorageService.cs` — saves to `wwwroot/uploads/{folder}/`, returns `/uploads/...` URL
- `Services/AwsS3FileStorageService.cs` — uploads to S3, returns public CDN URL
- `Controllers/UploadController.cs` — `POST /api/v1/upload?folder=campaigns`, returns `{ url }`

**Files modified:**
- `Crm.Api.csproj` — add `AWSSDK.S3` package reference
- `Program.cs` — register `IFileStorageService` based on `FILE_STORAGE_PROVIDER` env var

**Commit**: `feat(api-crm): file storage abstraction with local and S3 providers`

---

### Phase 3 — Backend: Campaign Service/Repo/Controller + Template CRUD

**Services touched**: `apps/api-crm`

**Files created:**
- `DTOs/Requests/CreateCampaignRequestDto.cs` — title, subject, description (required); channels: List<string>; scheduleType; recurrenceDays?; startDate?; endDate?; imageUrl?; templateId?
- `DTOs/Requests/UpdateCampaignRequestDto.cs` — all optional, for draft patching
- `DTOs/Requests/AttachPromotionsToCampaignRequestDto.cs` — `promotionIds: List<Guid>`
- `DTOs/Requests/CreateTemplateRequestDto.cs`
- `DTOs/Responses/CampaignListResponseDto.cs` — id, title, channels, status, createdAt
- `DTOs/Responses/CampaignResponseDto.cs` — full detail + schedule + linked promotions
- `DTOs/Responses/TemplateListResponseDto.cs`
- `DTOs/Responses/TemplateResponseDto.cs`
- `Validators/CreateCampaignRequestValidator.cs`
- `Mappers/CampaignMapper.cs`
- `Mappers/TemplateMapper.cs`
- `Interfaces/Repositories/ICampaignRepository.cs`
- `Repositories/CampaignRepository.cs` — GetAllAsync(status?), GetByIdAsync, AddAsync, UpdateAsync
- `Interfaces/Services/ICampaignService.cs`
- `Services/CampaignService.cs` — status transitions (Draft→Active, Active→Ended), schedule creation, AttachPromotionsAsync
- `Controllers/CampaignsController.cs`

  | Method | Route | Action |
  |---|---|---|
  | GET | `/api/v1/campaigns?status=` | List by status |
  | GET | `/api/v1/campaigns/{id}` | Get single |
  | POST | `/api/v1/campaigns` | Create (Draft or Active) |
  | PUT | `/api/v1/campaigns/{id}` | Update draft |
  | PUT | `/api/v1/campaigns/{id}/status` | Change status |
  | POST | `/api/v1/campaigns/{id}/promotions` | Attach promotions |
  | DELETE | `/api/v1/campaigns/{id}` | End / soft-delete |

- `Controllers/TemplatesController.cs` — full CRUD at `/api/v1/templates`

**Files modified:**
- `Program.cs` — register `ICampaignRepository`, `ICampaignService`

**Tests created:**
- `tests/Crm.Api.Tests/Controllers/CampaignsControllerTests.cs`
- `tests/Crm.Api.Tests/Services/CampaignServiceTests.cs`

**Commit**: `feat(api-crm): Campaign CRUD, CampaignService, CampaignsController, TemplatesController`

---

### Phase 4 — Backend: Promotion Service/Repo/Controller

**Services touched**: `apps/api-crm`

**Files created:**
- `DTOs/Requests/CreatePromotionRequestDto.cs`
- `DTOs/Requests/UpdatePromotionRequestDto.cs`
- `DTOs/Requests/UpdatePromotionStatusRequestDto.cs`
- `DTOs/Responses/PromotionListResponseDto.cs`
- `DTOs/Responses/PromotionResponseDto.cs`
- `Validators/CreatePromotionRequestValidator.cs` — Voucher type requires voucherCode; Discount/Cashback requires discountValue
- `Validators/UpdatePromotionStatusRequestValidator.cs`
- `Mappers/PromotionMapper.cs`
- `Interfaces/Repositories/IPromotionRepository.cs`
- `Repositories/PromotionRepository.cs`
- `Interfaces/Services/IPromotionService.cs`
- `Services/PromotionService.cs` — status transitions (Draft→Active, Active→Cancelled); cannot edit Cancelled/Accomplished
- `Controllers/PromotionsController.cs`

  | Method | Route | Action |
  |---|---|---|
  | GET | `/api/v1/promotions?status=` | List by status |
  | GET | `/api/v1/promotions/{id}` | Get single |
  | POST | `/api/v1/promotions` | Create |
  | PUT | `/api/v1/promotions/{id}` | Update (draft only) |
  | PUT | `/api/v1/promotions/{id}/status` | Change status |

**Files modified:**
- `Program.cs` — register `IPromotionRepository`, `IPromotionService`

**Tests created:**
- `tests/Crm.Api.Tests/Controllers/PromotionsControllerTests.cs`
- `tests/Crm.Api.Tests/Services/PromotionServiceTests.cs`

**Commit**: `feat(api-crm): Promotion CRUD, PromotionService, PromotionsController`

---

### Phase 5 — Backend: Background Jobs

**Services touched**: `apps/api-crm`

**Files created:**
- `BackgroundJobs/CampaignStatusJob.cs` — IHostedService, runs every 5 min, ends expired Active campaigns
- `BackgroundJobs/PromotionStatusJob.cs` — IHostedService, runs every 5 min, accomplishes expired Active promotions

**Files modified:**
- `Program.cs` — `AddHostedService<CampaignStatusJob>()`, `AddHostedService<PromotionStatusJob>()`

**Commit**: `feat(api-crm): background jobs to auto-end campaigns and auto-accomplish promotions`

---

### Phase 6 — Frontend: Shared Types + API Client Extensions

**Services touched**: `apps/web-crm`

**Files created:**
- `src/types/campaign.ts` — CampaignStatus, CampaignChannel (Email|InApp|Facebook|Twitter|Instagram), ScheduleType, Campaign, CampaignListItem, CampaignSchedule, CreateCampaignInput, Template
- `src/types/promotion.ts` — PromotionType, PromotionStatus, Promotion, PromotionListItem, CreatePromotionInput
- `src/types/ticket.ts` — TicketStatus, Ticket, TicketListItem, CreateTicketInput, PaginatedTicketResponse

**Files modified:**
- `src/lib/api/crm-client.ts` — add namespaces: campaigns, promotions, templates, tickets, upload (uploadFile)

**Commit**: `feat(web): campaign, promotion, ticket shared types and crm-client extensions`

---

### Phase 7 — Frontend: Custom Hooks

**Services touched**: `apps/web-crm`

Follows `useCustomers.ts` pattern — isLoading, error, data, refetch().

**Files created:**
- `src/hooks/useCampaigns.ts`
- `src/hooks/useCampaign.ts`
- `src/hooks/usePromotions.ts`
- `src/hooks/usePromotion.ts`
- `src/hooks/useTickets.ts`
- `src/hooks/useTicket.ts`
- `src/hooks/useTemplates.ts`

**Commit**: `feat(web): campaign, promotion, ticket and template custom hooks`

---

### Phase 8 — Frontend: Campaigns Module (CRM-002 + CRM-004)

**Services touched**: `apps/web-crm`

**Files deleted:** `campaigns/types.ts`, `CampaignMetricsCards.tsx`, `CampaignLaunchSheet.tsx`

**Files created:**
- `CampaignFormSheet.tsx` — Title, Subject, Description; channel multi-select (Email/InApp/Facebook/Twitter/Instagram) as pill toggles; Schedule section (SendNow/Scheduled/Recurring with conditional recurring days + date pickers); Template picker dropdown; Image upload → calls upload endpoint; Link Promotions multi-select checkbox list (CRM-004); "Save as Draft" / "Activate" dual submit
- `CampaignDetailSheet.tsx` — full detail + schedule + linked promotion badges + Activate/End buttons
- `CampaignChannelBadge.tsx` — channel-to-icon mapping (Mail, BellDot, Facebook, Twitter, Instagram)

**Files modified:**
- `CampaignTable.tsx` — wire to CampaignListItem, remove mock columns, add Title/Channels/Status/CreatedAt, horizontally scrollable on mobile
- `Campaigns.tsx` — replace hardcoded state with `useCampaigns(activeTab)`, shadcn Tabs (Campaign List / Drafts / History), mobile-first layout

**Commit**: `feat(web): campaigns module — 3-tab layout, API integration, channel multi-select, promotion linking`

---

### Phase 9 — Frontend: Promotions Module (CRM-003)

**Services touched**: `apps/web-crm`

**Files created (new folder `components/features/promotions/`):**
- `Promotions.tsx` — 4-tab layout (All/Active, Drafts, Cancelled, Accomplished), `usePromotions(activeTab)`
- `PromotionFormSheet.tsx` — Title, Description, Type Select; conditional Discount Value / Voucher Code; Start/End DatePicker; "Save as Draft" / "Activate" buttons
- `PromotionDetailSheet.tsx` — full detail, "Edit" for Drafts, "Cancel Promotion" for Active
- `PromotionTable.tsx` — Title, Type, Status, Discount/Code, End Date, Actions; horizontally scrollable mobile
- `PromotionTypeBadge.tsx`, `PromotionStatusBadge.tsx`

**Files created (pages):**
- `src/app/promotions/page.tsx`

**Files modified:**
- `src/components/shared/Sidebar.tsx` — add Promotions nav item (Tag icon)
- `src/components/shared/MobileNav.tsx` — add Promotions nav item

**Commit**: `feat(web): promotions module — 4-tab layout, form/detail sheets, API integration`

---

### Phase 10 — Frontend: Tickets Staff View (CRM-005)

**Services touched**: `apps/web-crm`

**Files deleted:** `tickets/types.ts`, `tickets/TicketFilters.tsx`

**Files created:**
- `TicketDetailSheet.tsx` — full detail, Claim/Unclaim buttons, Message placeholder, image thumbnail

**Files modified:**
- `TicketTable.tsx` — remove mock columns, add Title/Customer/Status/CreatedAt, horizontal scroll mobile
- `TicketCreateSheet.tsx` — wire to real API, add image upload
- `Tickets.tsx` — 3-tab layout (Available/Claimed/Completed), `useTickets(activeTab)`, refetch after claim/unclaim

**Commit**: `feat(web): tickets staff view — 3-tab layout, real API, claim/unclaim, image upload`

---

### Phase 11 — Frontend: Tickets Customer View (CRM-006)

**Services touched**: `apps/web-crm`

**Files created:**
- `TicketsCustomerView.tsx` — 4-tab layout (Pending/Ongoing/Completed/Cancelled); Pending merges Unclaimed+Claimed from API; Create Ticket + Cancel + Message placeholder; customerId prop
- `src/app/tickets/customer/page.tsx`

**Commit**: `feat(web): tickets customer view — 4-tab layout, create/cancel, message placeholder`

---

### Phase 12 — Tests

**Backend (xUnit + Moq):**
- `CampaignsControllerTests.cs` — list by status, create, attach promotions
- `CampaignServiceTests.cs` — Draft→Active, Active→Ended, cannot activate without channels
- `PromotionsControllerTests.cs` — CRUD happy paths, status update
- `PromotionServiceTests.cs` — type validation (Voucher/Discount), cannot edit Cancelled

**Frontend (Jest + Testing Library):**
- `useCampaigns.test.ts`, `usePromotions.test.ts`, `useTickets.test.ts`
- `CampaignFormSheet.test.tsx` — channel toggles, recurring days conditional, promotion picker
- `PromotionFormSheet.test.tsx` — conditional Voucher Code / Discount Value fields

**Commit**: `test(api-crm): campaign and promotion controller and service tests`
**Commit**: `test(web): campaign, promotion, and ticket hook and form tests`

---

### Phase 13 — Docs Update

**Files modified:**
- `docs/architecture/crm-data-model.md` — add Promotion entity, CampaignPromotion join table, update Campaign.Channels
- `docs/be-backlogs.md` — mark all Sprint 2 items complete
- `docs/fe-backlogs.md` — mark all Sprint 2 items complete

**Commit**: `docs: update crm-data-model (Promotion, CampaignPromotion, multi-channel), check off Sprint 2 backlog`

---

## File Map

```
apps/api-crm/
  Models/
    Promotion.cs                                       [NEW]
    CampaignPromotion.cs                               [NEW]
    Template.cs                                        [NEW]
    Campaign.cs                                        [MODIFY] Channels: List<string>, nav props
  Data/
    AppDbContext.cs                                    [MODIFY]
    Configurations/
      PromotionConfiguration.cs                        [NEW]
      CampaignPromotionConfiguration.cs                [NEW]
      TemplateConfiguration.cs                         [NEW]
      CampaignConfiguration.cs                         [MODIFY]
    Migrations/
      *_AddPromotionsTemplatesAndCampaignChannelArray  [NEW — generated]
  Interfaces/
    IFileStorageService.cs                             [NEW]
    Repositories/
      ICampaignRepository.cs                           [NEW]
      IPromotionRepository.cs                          [NEW]
    Services/
      ICampaignService.cs                              [NEW]
      IPromotionService.cs                             [NEW]
  Repositories/
    CampaignRepository.cs                              [NEW]
    PromotionRepository.cs                             [NEW]
  Services/
    CampaignService.cs                                 [NEW]
    PromotionService.cs                                [NEW]
    LocalFileStorageService.cs                         [NEW]
    AwsS3FileStorageService.cs                         [NEW]
  BackgroundJobs/
    CampaignStatusJob.cs                               [NEW]
    PromotionStatusJob.cs                              [NEW]
  Validators/
    CreateCampaignRequestValidator.cs                  [NEW]
    CreatePromotionRequestValidator.cs                 [NEW]
    UpdatePromotionStatusRequestValidator.cs           [NEW]
  Mappers/
    CampaignMapper.cs                                  [NEW]
    PromotionMapper.cs                                 [NEW]
    TemplateMapper.cs                                  [NEW]
  DTOs/
    Requests/
      CreateCampaignRequestDto.cs                      [NEW]
      UpdateCampaignRequestDto.cs                      [NEW]
      AttachPromotionsToCampaignRequestDto.cs          [NEW]
      CreatePromotionRequestDto.cs                     [NEW]
      UpdatePromotionRequestDto.cs                     [NEW]
      UpdatePromotionStatusRequestDto.cs               [NEW]
      CreateTemplateRequestDto.cs                      [NEW]
    Responses/
      CampaignListResponseDto.cs                       [NEW]
      CampaignResponseDto.cs                           [NEW]
      PromotionListResponseDto.cs                      [NEW]
      PromotionResponseDto.cs                          [NEW]
      TemplateListResponseDto.cs                       [NEW]
      TemplateResponseDto.cs                           [NEW]
  Controllers/
    CampaignsController.cs                             [NEW]
    PromotionsController.cs                            [NEW]
    TemplatesController.cs                             [NEW]
    UploadController.cs                                [NEW]
  Program.cs                                           [MODIFY]
  Crm.Api.csproj                                       [MODIFY] + AWSSDK.S3
  tests/Crm.Api.Tests/
    Controllers/
      CampaignsControllerTests.cs                      [NEW]
      PromotionsControllerTests.cs                     [NEW]
    Services/
      CampaignServiceTests.cs                          [NEW]
      PromotionServiceTests.cs                         [NEW]

apps/web-crm/src/
  types/
    campaign.ts                                        [NEW]
    promotion.ts                                       [NEW]
    ticket.ts                                          [NEW]
  lib/api/
    crm-client.ts                                      [MODIFY]
  hooks/
    useCampaigns.ts                                    [NEW]
    useCampaign.ts                                     [NEW]
    usePromotions.ts                                   [NEW]
    usePromotion.ts                                    [NEW]
    useTickets.ts                                      [NEW]
    useTicket.ts                                       [NEW]
    useTemplates.ts                                    [NEW]
  app/
    promotions/page.tsx                                [NEW]
    tickets/customer/page.tsx                          [NEW]
  components/
    shared/
      Sidebar.tsx                                      [MODIFY]
      MobileNav.tsx                                    [MODIFY]
    features/
      campaigns/
        types.ts                                       [DELETE]
        CampaignMetricsCards.tsx                       [DELETE]
        CampaignLaunchSheet.tsx                        [DELETE/REPLACE]
        CampaignFormSheet.tsx                          [NEW]
        CampaignDetailSheet.tsx                        [NEW]
        CampaignChannelBadge.tsx                       [NEW]
        CampaignTable.tsx                              [MODIFY]
        Campaigns.tsx                                  [MODIFY]
      promotions/                                      [NEW FOLDER]
        Promotions.tsx
        PromotionFormSheet.tsx
        PromotionDetailSheet.tsx
        PromotionTable.tsx
        PromotionTypeBadge.tsx
        PromotionStatusBadge.tsx
      tickets/
        types.ts                                       [DELETE]
        TicketFilters.tsx                              [DELETE]
        TicketTable.tsx                                [MODIFY]
        TicketCreateSheet.tsx                          [MODIFY]
        TicketDetailSheet.tsx                          [NEW]
        Tickets.tsx                                    [MODIFY]
        TicketsCustomerView.tsx                        [NEW]
  __tests__/
    hooks/
      useCampaigns.test.ts                             [NEW]
      usePromotions.test.ts                            [NEW]
      useTickets.test.ts                               [NEW]
    components/features/
      campaigns/
        CampaignFormSheet.test.tsx                     [NEW]
      promotions/
        PromotionFormSheet.test.tsx                    [NEW]

docs/
  architecture/crm-data-model.md                       [MODIFY]
  be-backlogs.md                                       [MODIFY]
  fe-backlogs.md                                       [MODIFY]
  plans/implementations/
    sprint2-campaigns-promotions-tickets.md             [THIS FILE]
```

---

## Commit Sequence

| # | Commit message |
|---|---|
| 1 | `feat(api-crm): add Promotion, Template, CampaignPromotion models and migration` |
| 2 | `feat(api-crm): file storage abstraction with local and S3 providers` |
| 3 | `feat(api-crm): Campaign CRUD, CampaignService, CampaignsController, TemplatesController` |
| 4 | `feat(api-crm): Promotion CRUD, PromotionService, PromotionsController` |
| 5 | `feat(api-crm): background jobs to auto-end campaigns and auto-accomplish promotions` |
| 6 | `feat(web): campaign, promotion, ticket shared types and crm-client extensions` |
| 7 | `feat(web): campaign, promotion, ticket and template custom hooks` |
| 8 | `feat(web): campaigns module — 3-tab layout, API integration, channel multi-select, promotion linking` |
| 9 | `feat(web): promotions module — 4-tab layout, form/detail sheets, API integration` |
| 10 | `feat(web): tickets staff view — 3-tab layout, real API, claim/unclaim, image upload` |
| 11 | `feat(web): tickets customer view — 4-tab layout, create/cancel, message placeholder` |
| 12 | `test(api-crm): campaign and promotion controller and service tests` |
| 13 | `test(web): campaign, promotion, and ticket hook and form tests` |
| 14 | `docs: update crm-data-model (Promotion, CampaignPromotion, multi-channel), check off Sprint 2 backlog` |

---

## Verification Plan

```bash
# Backend — all tests must pass
dotnet test apps/api-crm/tests/Crm.Api.Tests/

# Frontend — all tests must pass
pnpm --filter web-crm test
```

Manual smoke-test after `pnpm dev`:

1. **Campaigns**: Create campaign with Email + Facebook channels, scheduled with end date. Verify 3-tab filtering.
2. **Template**: Create template, select from campaign form picker.
3. **Image Upload**: Upload image in campaign form. Verify URL saved and displayed.
4. **Promotions**: Create Voucher promotion (requires voucher code). Activate. Cancel. Verify tab filtering.
5. **Campaign–Promotion linking**: Link promotion to a campaign. Verify in CampaignDetailSheet.
6. **Background job**: Set campaign end date in the past. Wait 5 min. Verify status flips to Ended.
7. **Tickets (Staff)**: Available tab shows Unclaimed. Claim → moves to Claimed. Complete → Completed.
8. **Tickets (Customer)**: Create → Pending. Cancel → Cancelled.
9. **Mobile**: Resize to 375px — tabs scroll, forms full-width, no overflow.
