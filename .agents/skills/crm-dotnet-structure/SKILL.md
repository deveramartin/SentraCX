---
name: crm-dotnet-structure
description: Enforces the .NET project structure, strict Controller→Service→Repository layering, and file-placement conventions for apps/api-crm. Load when creating or editing any file under that service.
category: Architecture
---

## Objective
Establish and enforce clean architecture boundaries and directory structure for the .NET 10 `api-crm` backend application.

## Instructions
1. Follow the standard directory structure for `apps/api-crm`:
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

2. Follow strict layering rules:
   - **Controllers**: HTTP concerns only — routing, request binding, status codes. Delegate all logic to `Services/`. A controller must never query `AppDbContext` directly and must never contain business rules.
   - **Services**: Business logic layer. One service per domain aggregate (`CustomerService`, `TicketService`, `MessageService`, etc.). Implements a corresponding interface in `Interfaces/Services/`. Calls `Repositories/` for data access. No HTTP-specific code.
   - **Repositories**: Data access only, one repository per entity/aggregate. Implements a corresponding interface in `Interfaces/Repositories/`. No business logic.
   - **Interfaces/**: One interface file per service or repository. All services and repositories are registered against their interface in `Program.cs`.
   - **Hubs/**: SignalR hub classes only. `ChatHub.cs` handles real-time WebSocket connections for the ticket chat feature.
   - **DTOs/Requests** and **DTOs/Responses**: One DTO per shape. Don't reuse a DTO across unrelated endpoints just to avoid creating a new file.
   - **Mappers**: Entity ↔ DTO mapping only. No business logic, no validation.
   - **Validators**: One FluentValidation validator per request DTO.
   - **Models**: EF Core entities only, must mirror `docs/architecture/crm-data-model.md`. No business logic or persistence side-effects in entity classes.
   - **Middleware / Filters / Extensions / Helpers**: Cross-cutting utilities only, kept small and single-purpose.
   - **Data/Migrations**: EF Core generated migrations only — never hand-edited.
   - **tests/**: Mirrors the source tree 1:1 — a new `Services/TicketService.cs` requires a matching `tests/Crm.Api.Tests/Services/TicketServiceTests.cs`.
   - New top-level folders are allowed for genuinely new cross-cutting concerns (e.g. a future `BackgroundJobs/` folder), but must not blur the Controller → Service → Repository layering.

## Validation Checklist
* [ ] Controller delegates all business logic to services without directly querying `AppDbContext`.
* [ ] Services and repositories implement interfaces registered in `Program.cs`.
* [ ] Request/Response DTOs are explicitly defined and mapped cleanly using `Mappers/`.
* [ ] Unit/Integration tests in `tests/Crm.Api.Tests/` mirror new source files 1:1.