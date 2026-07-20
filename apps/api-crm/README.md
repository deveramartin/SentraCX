# api-crm

SentraCX CRM Backend API — .NET 10 Web API with Entity Framework Core.

## Tech Stack

- **.NET 10** — Web API framework
- **Entity Framework Core 10** — ORM / data access (Npgsql provider)
- **PostgreSQL** — Primary database
- **SignalR + Redis** — Real-time WebSocket chat (Redis Pub/Sub backplane)
- **FluentValidation** — Request validation
- **Scalar / OpenAPI** — API documentation
- **JWT Bearer** — Authentication (tokens issued by external OIDC provider)

## Getting Started

### Prerequisites

- [.NET SDK 10.0+](https://dotnet.microsoft.com/download)
- [PostgreSQL 15+](https://www.postgresql.org/)
- [Redis](https://redis.io/) (for SignalR backplane in multi-instance deployments)

### Run (from monorepo root)

```bash
pnpm dev:api
```

### Run (standalone)

```bash
cd apps/api-crm
dotnet watch run --urls https://localhost:5005
```

### Build

```bash
pnpm build:api
# or
dotnet build -c Release
```

### Test

```bash
pnpm test:api
# or
dotnet test
```

## Configuration

Copy the example env file and populate the values:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Database name | `sentracx_crm` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `postgres` |
| `JWT_AUTHORITY` | OIDC issuer URL for JWT validation | `https://localhost:5001` |
| `JWT_AUDIENCE` | Expected JWT audience | `sentracx-crm-api` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |

## API Documentation

When running in development, Scalar API reference is available at:

- **Scalar**: https://localhost:5005/docs
- **OpenAPI spec**: https://localhost:5005/openapi/v1.json

Full API documentation: [docs/api/api-crm.md](../../docs/api/api-crm.md)

## Project Structure

```
api-crm/
├── Configurations/       → Options classes (bound from appsettings)
├── Constants/            → App-wide constants
├── Controllers/          → API endpoints (HTTP concerns only)
├── Data/
│   ├── AppDbContext.cs   → EF Core DbContext
│   ├── Migrations/       → EF Core generated migrations (never hand-edit)
│   └── Seed/             → Seed data scripts
├── DTOs/
│   ├── Requests/         → Incoming request shapes (one DTO per shape)
│   └── Responses/        → Outgoing response shapes (one DTO per shape)
├── Exceptions/           → Custom exception types
├── Extensions/           → Service collection extension methods
├── Filters/              → Action/exception filters
├── Helpers/              → Utility classes (e.g. EnvLoader)
├── Hubs/
│   └── ChatHub.cs        → SignalR hub for real-time ticket chat
├── Interfaces/
│   ├── Repositories/     → Repository interfaces (ICustomerProfileRepository, etc.)
│   └── Services/         → Service interfaces (ICustomerService, etc.)
├── Mappers/              → Entity ↔ DTO mapping only
├── Middleware/           → Custom middleware (e.g. JitProvisioningMiddleware)
├── Models/               → EF Core entities (mirrors docs/architecture/crm-data-model.md)
├── Repositories/         → Data access implementations
├── Services/             → Business logic implementations
├── Validators/           → FluentValidation validators (one per request DTO)
├── Properties/
│   └── launchSettings.json
├── tests/Crm.Api.Tests/  → Unit & integration tests (mirrors source 1:1)
│   ├── Controllers/
│   ├── Helpers/
│   ├── Hubs/
│   └── Services/
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── Crm.Api.csproj
```

## Port

| Environment | URL |
|-------------|-----|
| Development | https://localhost:5005 |
