# Phase 1: Foundation & CRM Backend Basics - Implementation Plan

## 1. Overview
This document serves as the comprehensive implementation blueprint for **Phase 1** of the SentraCX system. Phase 1 focuses exclusively on establishing the `.NET 10.0` CRM backend, setting up the primary PostgreSQL database, handling JIT identity provisioning from the Central Auth service, and building the foundational APIs for Customer Management and Order History ingestion.

**Goal:** Establish a robust API foundation that allows staff to view/manage customer contacts and order histories before advancing to complex features like ticketing and real-time chat in Phase 2 and 3.

---

## 2. Architecture & Design Principles

### Tech Stack
*   **Framework:** .NET 10.0 (Web API)
*   **Language:** C#
*   **Database:** PostgreSQL (Primary Store)
*   **ORM:** Entity Framework Core (EF Core)

### Layered Architecture Requirements
As dictated by `AGENTS.md`, the backend must strictly adhere to the following layers. **No cross-layer contamination is permitted.**
1.  **Controllers (`/Controllers`)**: HTTP routing, request binding, model validation mapping. Must delegate all business logic to Services.
2.  **Services (`/Services`)**: Domain/business logic. Encapsulates all rules and orchestrates database calls via Repositories. No HTTP concepts (`HttpContext`, Status Codes) are allowed here.
3.  **Repositories (`/Repositories`)**: Pure data access layer. One repository per aggregate root. No business logic.
4.  **Models (`/Models`)**: EF Core entity definitions mirroring the database schema.
5.  **DTOs (`/DTOs`)**: Request and Response shapes for API inputs and outputs.
6.  **Mappers (`/Mappers`)**: Conversion logic between Models and DTOs.

### Just-In-Time (JIT) Provisioning
Because SentraCX uses a Central Auth Service (`internal-auth-service`), the CRM does not handle passwords or login. Instead, it uses **JIT Provisioning**:
*   The API receives an incoming request with a JWT.
*   A custom middleware/filter validates the JWT.
*   If valid, it extracts the claims (`id`, `email`, `firstName`, `lastName`, `employeeNumber`).
*   It checks the local `User` table. If the user doesn't exist, it is created. If it exists, core details are updated to stay in sync.

---

## 3. Database Schema (EF Core Models)

The following entities must be created and configured via EF Core Fluent API.

### 3.1. `User` (Mirrored Identity)
```csharp
public class User
{
    public string Id { get; set; } // PK (Maps to external Auth UUID)
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
    public int? EmployeeNumber { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation property
    public CustomerProfile CustomerProfile { get; set; }
}
```

### 3.2. `CustomerProfile`
```csharp
public class CustomerProfile
{
    public Guid Id { get; set; } // PK
    public string UserId { get; set; } // FK to User
    public string PhoneNumber { get; set; }
    public string CustomerType { get; set; } // Enum: Regular, InstitutionalBuyer
    public string Status { get; set; } // Enum: Active, Inactive, Suspended
    public string Notes { get; set; }
    public string ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation property
    public User User { get; set; }
    public ICollection<OrderHistory> OrderHistories { get; set; }
}
```

### 3.3. `OrderHistory` (External Synced Data)
```csharp
public class OrderHistory
{
    public Guid Id { get; set; } // PK
    public Guid CustomerId { get; set; } // FK to CustomerProfile
    public string OrderNumber { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }
    public DateTime OrderedAt { get; set; }
    
    // Navigation property
    public CustomerProfile CustomerProfile { get; set; }
}
```

---

## 4. API Specifications

### Customer Management (`CustomersController`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | Returns a paginated list of customers (id, name, email, type, status). |
| `GET` | `/api/v1/customers/{id}` | Returns comprehensive details including the `CustomerProfile` and associated `User` data. |
| `POST` | `/api/v1/customers` | Manually creates a new external customer (triggers Auth service creation eventually, but locally inserts User + Profile). |
| `PUT` | `/api/v1/customers/{id}/status` | Updates `CustomerProfile.Status` (Active, Inactive, Suspended). |
| `PUT` | `/api/v1/customers/{id}/type` | Updates `CustomerProfile.CustomerType` (Regular, InstitutionalBuyer). |
| `PUT` | `/api/v1/customers/{id}/notes` | Updates `CustomerProfile.Notes`. |
| `DELETE` | `/api/v1/customers/{id}` | Soft-deletes a customer by flagging `User.IsDeleted = true`. |

### Order History Ingestion & Retrieval (`OrdersController` & `WebhooksController`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customers/{id}/orders` | Returns a list of `OrderHistory` items belonging to the customer. |
| `POST` | `/api/v1/webhooks/orders` | Ingests `OrderCreated` and `OrderUpdated` events from the eCommerce platform. |

---

## 5. Step-by-Step Implementation Backlog

### Step 1: Project Initialization
- [x] Run `dotnet new webapi -n Crm.Api` inside `apps/api-crm`.
- [x] Scaffold folder structure (`Controllers`, `Services`, `Repositories`, `Models`, `DTOs`, `Mappers`, `Helpers`, `Middleware`, `Configurations`).
- [x] Install required NuGet packages: `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.AspNetCore.Authentication.JwtBearer`, `AutoMapper`, `FluentValidation`.

### Step 2: Database Setup & Configuration
- [x] Define `AppDbContext.cs` inside `Data/` folder.
- [x] Implement EF Core Entity Configurations (Fluent API) for `User`, `CustomerProfile`, and `OrderHistory`.
- [x] Add PostgreSQL connection string to `appsettings.json`.
- [x] Generate initial migration: `dotnet ef migrations add InitialCreate`.
- [ ] Configure database application on startup (`dotnet ef database update`).

### Step 3: Identity & JIT Provisioning
- [x] Configure JWT Bearer authentication in `Program.cs`.
- [x] Create `JwtJitProvisioningMiddleware.cs` (or a custom `IClaimsTransformation`) to intercept valid tokens.
- [x] Implement logic to upsert `User` record into PostgreSQL based on JWT claims (ID, email, name, employee number).

### Step 4: Repositories & Services Implementation
- [x] Create `IUserRepository` / `UserRepository`.
- [x] Create `ICustomerProfileRepository` / `CustomerProfileRepository`.
- [x] Create `IOrderHistoryRepository` / `OrderHistoryRepository`.
- [x] Implement `CustomerService` encapsulating CRUD business logic.
- [x] Implement `OrderService` encapsulating webhook ingestion logic and history retrieval.

### Step 5: Controllers & DTOs
- [x] Define Request/Response DTOs in `DTOs/` (e.g., `CustomerResponseDto`, `UpdateCustomerStatusRequestDto`).
- [x] Create `CustomersController` and wire up HTTP endpoints to `CustomerService`.
- [x] Create `OrdersController` (for viewing history) and `WebhooksController` (for ingestion).

### Step 6: Testing & Validation
- [x] Add FluentValidation rules for all incoming Request DTOs.
- [ ] Create `tests/Crm.Api.Tests` xUnit project.
- [ ] Write Unit Tests for `CustomerService` and `OrderService` (mocking Repositories).
- [ ] Write Integration Tests for `CustomersController` endpoints.
