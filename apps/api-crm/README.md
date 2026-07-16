# api-crm

SentraCX CRM Backend API — .NET 10 Web API with Entity Framework Core.

## Tech Stack

- **.NET 10** — Web API framework
- **Entity Framework Core** — ORM / data access
- **PostgreSQL** — Primary database
- **FluentValidation** — Request validation
- **Swagger / OpenAPI** — API documentation

## Getting Started

### Prerequisites

- [.NET SDK 10.0+](https://dotnet.microsoft.com/download)
- [PostgreSQL 15+](https://www.postgresql.org/)

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

Copy the example env file:

```bash
cp .env.example .env
```

Or configure via `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sentracx_crm;Username=postgres;Password=your-password"
  }
}
```

## API Documentation

When running in development, Swagger UI is available at:

- **Swagger UI**: https://localhost:5005/swagger
- **OpenAPI spec**: https://localhost:5005/swagger/v1/swagger.json

## Project Structure

```
api-crm/
├── Controllers/          # API endpoints
├── Models/               # EF entities / domain models
├── DTOs/
│   ├── Requests/         # Incoming request shapes
│   └── Responses/        # Outgoing response shapes
├── Mappers/              # Entity <-> DTO mapping
├── Data/
│   ├── AppDbContext.cs   # EF Core DbContext
│   ├── Migrations/       # EF migrations
│   └── Seed/             # Seed data
├── Services/             # Business logic
├── Repositories/         # Data access abstraction
├── Helpers/              # Utility classes
├── Validators/           # FluentValidation validators
├── Middleware/           # Custom middleware
├── Filters/              # Action/exception filters
├── Extensions/           # Service collection extensions
├── Configurations/       # Options classes (bound from appsettings)
├── Constants/            # App-wide constants
├── Exceptions/           # Custom exception types
├── tests/                # Unit & integration tests
├── Properties/
│   └── launchSettings.json
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
├── Crm.Api.csproj
└── Dockerfile
```

## Docker

```bash
docker build -t sentracx-api-crm .
docker run -p 5005:8080 sentracx-api-crm
```

## Port

| Environment | URL |
|-------------|-----|
| Development | https://localhost:5005 |
| Docker      | http://localhost:5005 (mapped from 8080) |
