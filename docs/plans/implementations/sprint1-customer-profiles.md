# Sprint 1 — CRM-001: Customer Profiles (Contacts & Leads) Implementation Plan

## Scope

Implement the remaining gaps for the Customer Profiles feature across backend (CRM API) and
frontend (web-crm), as defined in `docs/fe-backlogs.md` and `docs/be-backlogs.md`.

---

## Current State Audit

### What already exists

#### Backend (`apps/api-crm`)
| Layer | Files | Coverage |
|---|---|---|
| Models | `User.cs`, `CustomerProfile.cs`, `MarketingInteraction.cs`, `OrderHistory.cs` | All Sprint 1 entities present |
| EF Configurations | `UserConfiguration.cs`, `CustomerProfileConfiguration.cs`, `OrderHistoryConfiguration.cs`, `MessageConfiguration.cs`, `MarketingInteractionConfiguration.cs` | Complete |
| DTOs (Request) | `CreateCustomerRequestDto`, `UpdateCustomerStatusRequestDto`, `UpdateCustomerTypeRequestDto`, `UpdateCustomerNotesRequestDto` | All present |
| DTOs (Response) | `CustomerListResponseDto`, `CustomerResponseDto`, `MarketingInteractionResponseDto`, `OrderResponseDto`, `PaginatedResponseDto` | All present |
| Controller | `CustomersController.cs` — `GET /`, `GET /{id}`, `POST`, `PUT /{id}/status`, `PUT /{id}/type`, `PUT /{id}/notes`, `DELETE /{id}` | Core CRUD done |
| Controller | `MarketingInteractionsController.cs` — paginated list by customer | Done |
| Controller | `OrdersController.cs` — list by customer | Done |
| Services | `CustomerService.cs`, `MarketingInteractionService.cs`, `OrderService.cs` | Implemented |
| Tests | `CustomerServiceTests.cs`, `CustomersControllerTests.cs`, `OrderServiceTests.cs` | Partial |

#### Frontend (`apps/web-crm`)
| Layer | Files | Coverage |
|---|---|---|
| Types | `customer.ts` — all interfaces/types | Complete |
| API Client | `crm-client.ts` — full customer, order, marketing CRUD | Complete |
| Hooks | `useCustomers.ts`, `useCustomer.ts`, `useCustomerOrders.ts`, `useCustomerMarketingHistory.ts` | Complete |
| Validators | `customer-validators.ts` | Present |
| Pages | `customers/page.tsx`, `customers/[id]/page.tsx` | Present |
| Components | 15 files in `components/features/customers/` | Extensive |

> **Summary**: The core happy path for customer CRUD, status/type/notes updates, detail page
> with Overview/Marketing/Orders tabs, delete dialog, and form sheet are **all implemented**.

---

## Gap Analysis — What's Missing

After comparing the backlog items against the codebase, the following gaps remain:

### Gap 1: Contacts vs. Leads Tab Separation (Frontend)

**Backlog item**: *"Customer module with separate tabs for contacts and leads"*

**Current state**: `CustomerProfiles.tsx` renders a single flat list with no tab distinction.
The data model's `CustomerType` enum has `Regular` and `InstitutionalBuyer` — there is no
`Lead` type in the data model at all.

**Decision needed before implementing**:

> **IMPORTANT**
> The CRM data model (`docs/architecture/crm-data-model.md`) defines `CustomerType` as
> `(Regular, InstitutionalBuyer)`. The backlog references **leads** as a distinct concept with
> special rules (locked type, no order history tab). This requires a data model decision:
>
> **Option A**: Add `"Lead"` as a third `CustomerType` value — simplest, keeps one entity.
> **Option B**: Add a separate boolean `isLead` flag on `CustomerProfile`.
> **Option C**: Treat leads as a concept purely derived from not having an ecommerce signup
> (i.e., those without order history).
>
> **Recommendation**: Option A — add `"Lead"` to `CustomerType`. It aligns with the backlog's
> intent that leads have locked type, no orders tab, and are visually separated.

**Implementation (once decision is confirmed)**:

| Service | File | Change |
|---|---|---|
| CRM API | `CustomerProfile.cs` | No model change needed (type is stored as string) |
| CRM API | `CreateCustomerRequestDto.cs` | Accept `"Lead"` as valid value |
| CRM API | `CustomerService.cs` | Add validation: if type is `"Lead"`, reject type-update requests |
| CRM API | `CustomerService.cs` | Filter `GetAllAsync` to accept optional `customerType` query param |
| CRM API | `CustomersController.cs` | Add `customerType` query param to `GET /` |
| CRM API | `OrdersController.cs` | Return 403/empty if customer is a lead |
| Web | `customer.ts` | Add `"Lead"` to `CustomerType` union |
| Web | `crm-client.ts` | Pass `customerType` filter param to list endpoint |
| Web | `useCustomers.ts` | Accept `customerType` filter option |
| Web | `CustomerProfiles.tsx` | Add Tabs component: "Contacts" tab (Regular/InstitutionalBuyer/VIP), "Leads" tab (Lead) |
| Web | `CustomerFormSheet.tsx` | Add `"Lead"` to type selector |
| Web | `CustomerDetail.tsx` | Conditionally hide "Order History" tab for leads |
| Web | `CustomerTypeControl.tsx` | Disable dropdown when customer type is Lead |

### Gap 2: Phone Number and Created At in List View (Frontend)

**Backlog item**: *"Contact/lead list view showing name, email, phone (optional), customer type, created at"*

**Current state**: `CustomerTable.tsx` shows: Name, Email, Type, Status, Actions. Missing:
**phone** and **created at** columns.

| Service | File | Change |
|---|---|---|
| CRM API | `CustomerListResponseDto.cs` | Add `PhoneNumber` and `CreatedAt` fields |
| CRM API | `CustomerMapper.cs` | Map new fields in `ToListResponse` |
| Web | `customer.ts` | Add `phoneNumber` to `CustomerListItem` (`createdAt` already present) |
| Web | `CustomerTable.tsx` | Add phone and created-at columns |

### Gap 3: VIP Customer Type (Backend + Frontend)

**Backlog item**: *"Customer type control: vip / regular / institutional buyer"*

**Current state**: `CustomerType` only has `Regular` and `InstitutionalBuyer`. **VIP is missing**.

| Service | File | Change |
|---|---|---|
| CRM API | No model change (string-based) | Validation accepts `"VIP"` |
| Web | `customer.ts` | Add `"VIP"` to `CustomerType` union |
| Web | `CustomerTypeControl.tsx` | Add VIP option to select |
| Web | `CustomerTypeBadge.tsx` | Add VIP badge styling |
| Web | `CustomerFormSheet.tsx` | Add VIP to create form type selector |

### Gap 4: Address Field (Backend + Frontend)

**Backlog item**: *"Overview tab: display name, email, address (optional), created at, ..."*

**Current state**: `CustomerProfile` model has no `address` field. The data model doc
(`crm-data-model.md`) also omits it.

> **WARNING**
> The backlog mentions "address (optional)" but the data model doesn't include it. This is a
> gap in the specification.
>
> **Recommendation**: Add an optional `address` string field to `CustomerProfile`. This
> requires a new EF migration. Alternatively, confirm with stakeholders if this should be
> deferred.

**Implementation (if confirmed)**:

| Service | File | Change |
|---|---|---|
| CRM API | `CustomerProfile.cs` | Add `public string? Address { get; set; }` |
| CRM API | `CustomerProfileConfiguration.cs` | Configure `HasMaxLength(500)` |
| CRM API | EF Migration | `dotnet ef migrations add AddCustomerAddress` |
| CRM API | `CustomerResponseDto.cs` | Add `Address` field |
| CRM API | `CreateCustomerRequestDto.cs` | Add optional `Address` field |
| CRM API | `CustomerMapper.cs` | Map address in both directions |
| Web | `customer.ts` | Add `address` to `Customer` and `CreateCustomerInput` |
| Web | `CustomerOverviewTab.tsx` | Display address in attributes grid |
| Web | `CustomerFormSheet.tsx` | Add address input field |
| Docs | `crm-data-model.md` | Add address to CustomerProfile entity definition |

### Gap 5: Webhook Auto-Creation (Backend)

**Backlog items**:
- *"auto-create a customer contact record on ecommerce website signup"*
- *"auto-create a customer lead record when any lead-gen form is submitted"*

**Current state**: `WebhooksController.cs` exists but only has a single
`OrderWebhookRequestDto`. No endpoint for user-signup or lead-gen webhooks.

| Service | File | Change |
|---|---|---|
| CRM API | `DTOs/Requests/CustomerWebhookRequestDto.cs` | New DTO for webhook payload |
| CRM API | `WebhooksController.cs` | `POST /api/v1/webhooks/customer-signup` — creates contact |
| CRM API | `WebhooksController.cs` | `POST /api/v1/webhooks/lead-submission` — creates lead |
| CRM API | `CustomerService.cs` or new `WebhookService.cs` | Webhook processing logic |
| CRM API | Tests | Webhook endpoint tests |

### Gap 6: Discarded Item Confirmation

**Backlog item**: *"Email button on profile redirecting to campaign — marked Discarded"*

> Both backlogs mark this as discarded. **No implementation needed.** Keeping this note for
> traceability.

---

## Implementation Order

The work is organized into atomic commits that can be delivered incrementally.

### Phase 1 — Data Model Alignment (Backend)
> Prerequisite: confirm decisions on Lead type, VIP type, and Address field.

1. **Add VIP + Lead to accepted CustomerType values** — update validation, add type-change
   guard for leads
2. **Add address field** (if confirmed) — model, migration, DTOs, mapper
3. **Add phone/createdAt to list DTO** — `CustomerListResponseDto`, mapper
4. **Add customerType filter to GET /customers** — controller query param, repository filter
5. **Lead guard on orders endpoint** — return empty/403 for lead-type customers

### Phase 2 — Webhook Endpoints (Backend)
6. **Customer signup webhook** — DTO, controller endpoint, service logic
7. **Lead submission webhook** — DTO, controller endpoint, service logic

### Phase 3 — Frontend Contacts/Leads Tabs
8. **Update types** — add `VIP`, `Lead` to union; add `phoneNumber` to list item if missing
9. **Update `crm-client.ts`** — pass customerType filter
10. **Update `useCustomers.ts`** — accept customerType filter
11. **Refactor `CustomerProfiles.tsx`** — add Tabs ("Contacts" / "Leads"), each rendering
    `CustomerTable` with the appropriate filter
12. **Update `CustomerTable.tsx`** — add phone + created-at columns
13. **Update `CustomerFormSheet.tsx`** — add VIP/Lead + address options

### Phase 4 — Frontend Detail Page Enhancements
14. **Update `CustomerDetail.tsx`** — hide Order History tab when customer type is Lead
15. **Update `CustomerTypeControl.tsx`** — disable/lock dropdown for leads
16. **Update `CustomerTypeBadge.tsx`** — add VIP + Lead badge variants
17. **Update `CustomerOverviewTab.tsx`** — show address field if present

### Phase 5 — Tests
18. **Backend tests** — type-change guard for leads, webhook endpoints, customerType filter
19. **Frontend tests** — tab filtering logic, lead-specific UI hiding

---

## Files Created or Modified

### New Files
| Path | Purpose |
|---|---|
| `apps/api-crm/DTOs/Requests/CustomerWebhookRequestDto.cs` | Webhook payload shape |
| `apps/api-crm/Data/Migrations/*_AddCustomerAddress.cs` | EF migration (if address confirmed) |

### Modified Files
| Path | Change Summary |
|---|---|
| `apps/api-crm/Models/CustomerProfile.cs` | Add `Address` field (if confirmed) |
| `apps/api-crm/Data/Configurations/CustomerProfileConfiguration.cs` | Configure address column |
| `apps/api-crm/DTOs/Responses/CustomerListResponseDto.cs` | Add phone + createdAt |
| `apps/api-crm/DTOs/Responses/CustomerResponseDto.cs` | Add address |
| `apps/api-crm/DTOs/Requests/CreateCustomerRequestDto.cs` | Add address, accept Lead/VIP |
| `apps/api-crm/Mappers/CustomerMapper.cs` | Map new fields |
| `apps/api-crm/Controllers/CustomersController.cs` | Add customerType query filter |
| `apps/api-crm/Controllers/OrdersController.cs` | Lead guard |
| `apps/api-crm/Controllers/WebhooksController.cs` | Signup + lead-gen endpoints |
| `apps/api-crm/Services/CustomerService.cs` | Filter logic, type-change guard, webhook |
| `apps/api-crm/Interfaces/Services/ICustomerService.cs` | New method signatures |
| `apps/api-crm/Interfaces/Repositories/ICustomerProfileRepository.cs` | Filter-by-type method |
| `apps/api-crm/Repositories/CustomerProfileRepository.cs` | Implement type filter |
| `apps/web-crm/src/types/customer.ts` | Add VIP, Lead, address, phoneNumber to list |
| `apps/web-crm/src/lib/api/crm-client.ts` | customerType filter param |
| `apps/web-crm/src/hooks/useCustomers.ts` | Accept customerType option |
| `apps/web-crm/src/components/features/customers/CustomerProfiles.tsx` | Tabs split |
| `apps/web-crm/src/components/features/customers/CustomerTable.tsx` | Phone + date columns |
| `apps/web-crm/src/components/features/customers/CustomerDetail.tsx` | Hide orders for leads |
| `apps/web-crm/src/components/features/customers/CustomerFormSheet.tsx` | VIP/Lead + address |
| `apps/web-crm/src/components/features/customers/CustomerTypeControl.tsx` | Lock for leads |
| `apps/web-crm/src/components/features/customers/CustomerTypeBadge.tsx` | VIP/Lead variants |
| `apps/web-crm/src/components/features/customers/CustomerOverviewTab.tsx` | Show address |
| `docs/architecture/crm-data-model.md` | Add address to CustomerProfile entity (if confirmed) |

---

## Architecture Docs Impacted
- `docs/architecture/crm-data-model.md` — CustomerProfile entity definition (address, VIP
  type), CustomerType enum values, ER diagram update

## Open Questions (Require Your Input)

1. **Lead type**: Should we add `"Lead"` as a `CustomerType` value (Option A recommended)?
2. **VIP type**: The backlog says "vip / regular / institutional buyer" — confirm adding `"VIP"` to the type enum?
3. **Address field**: The backlog mentions it but the data model omits it — add it as an optional string, or defer?
4. **Webhook payloads**: Do we have a defined schema from the ecommerce/lead-gen systems, or should we design a minimal one?
