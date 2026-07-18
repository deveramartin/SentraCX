# @api-crm — API Documentation

> SentraCX CRM API • .NET 10 Web API • Port 5005

## Overview

The CRM API handles all customer relationship management operations including contacts, deals, accounts, and related resources.

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `https://localhost:5005` |
| Production  | `https://api.sentracx.com` |

## Interactive Documentation (Scalar)

When running in development, Scalar API reference is available at:

```
https://localhost:5005/scalar/v1
```

OpenAPI specification:

```
https://localhost:5005/swagger/v1/swagger.json
```

## Authentication

All endpoints (except `/health`) require a valid JWT Bearer token:

```
Authorization: Bearer <token>
```

Tokens are issued by the Auth Service at `AUTH_ISSUER`.

## Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

### Contacts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/contacts` | List contacts (paginated) |
| GET | `/api/v1/contacts/:id` | Get contact by ID |
| POST | `/api/v1/contacts` | Create a contact |
| PUT | `/api/v1/contacts/:id` | Update a contact |
| DELETE | `/api/v1/contacts/:id` | Delete a contact |

### Deals

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/deals` | List deals (paginated) |
| GET | `/api/v1/deals/:id` | Get deal by ID |
| POST | `/api/v1/deals` | Create a deal |
| PUT | `/api/v1/deals/:id` | Update a deal |
| DELETE | `/api/v1/deals/:id` | Delete a deal |

### Accounts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/accounts` | List accounts (paginated) |
| GET | `/api/v1/accounts/:id` | Get account by ID |
| POST | `/api/v1/accounts` | Create an account |
| PUT | `/api/v1/accounts/:id` | Update an account |
| DELETE | `/api/v1/accounts/:id` | Delete an account |

### Tickets

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/tickets/:id` | Get ticket by ID |
| GET | `/api/v1/tickets/:id/messages` | Get ticket messages |

## Pagination

List endpoints support pagination via query parameters:

```
GET /api/v1/contacts?page=1&pageSize=20
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  }
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Not Found",
  "status": 404,
  "detail": "Contact with ID '123' was not found."
}
```

| Status | Description |
|--------|-------------|
| 400 | Validation error — check `errors` field |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict — duplicate resource |
| 500 | Internal server error |

## Running Locally

```bash
# From monorepo root
pnpm dev:api

# Standalone
cd apps/api-crm
dotnet watch run --urls https://localhost:5005
```
