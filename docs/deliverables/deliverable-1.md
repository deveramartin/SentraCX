# PROJECT MANAGEMENT

## WEEK 3 DELIVERABLES
**SentraCX Analytics & Predictive Enhancement**

**Document Version:** 1.0  
**Date:** July 17, 2026  
**Course:** Project Management (Capstone Enhancement)  
**Submitted By:** [Student Name(s)]  
**Instructor:** [Professor Name]  

---

## DELIVERABLE 1: PROVISIONED DATABASES (PROOF)

### 1.1 Overview of Polyglot Persistence

This document provides evidence that three distinct database technologies have been provisioned and are operational for the SentraCX project. This aligns with our polyglot persistence architecture, which strictly separates CRM transactional data from AI-Analytics workflows.

*(Note: Vector Store for NLP embeddings has not been provisioned in the current phase).*

| Database # | Database Type | Technology | Purpose | Status |
|---|---|---|---|---|
| **1** | Relational | PostgreSQL | Transactional data – SentraCX core CRM system | ✅ Running |
| **2** | Document Store | MongoDB | Analytical data – ML feature logs | ✅ Running |
| **3** | Key-Value Cache | Redis | In-Memory – AI insight caching & SignalR Pub/Sub | ✅ Running |

---

### 1.2 Database 1: PostgreSQL (CRM Production)

**Database Information**

| Attribute | Details |
|---|---|
| **Database Type** | Relational (OLTP) |
| **Technology** | PostgreSQL |
| **Purpose** | Single source of truth for transactional CRM data. |
| **Status** | **NEW** – Initialized via EF Core Migrations |
| **Access** | CRM (Read/Write) |
| **Database Name** | `sentracx_crm` |

**Screenshots**
*[Insert Screenshot 1: pgAdmin 4 successfully connected to PostgreSQL]*

**Connection Setup (C# from `api-crm/Program.cs`):**
```csharp
var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));
```

---

### 1.3 Database 2: MongoDB (AI-Analytics Document Store)

**Database Information**

| Attribute | Details |
|---|---|
| **Database Type** | Document-Oriented |
| **Technology** | MongoDB |
| **Purpose** | Store structured ML feature logs after they are processed by the insights service. |
| **Status** | **NEW** – Provisioned |
| **Access** | AI-Analytics (Python - Read/Write) |

**Screenshots**
*[Insert Screenshot 2: MongoDB Compass Connection]*

**Connection Setup (Python from `api-ai-analytics/app/main.py`):**
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Connecting to MongoDB at %s", settings.mongo_uri)
    await connect_mongo(settings.mongo_uri, settings.mongo_database)
    logger.info("MongoDB connected")
```

---

### 1.4 Database 3: Redis (Key-Value Cache & Pub/Sub)

**Database Information**

| Attribute | Details |
|---|---|
| **Database Type** | Key-Value In-Memory Data Store |
| **Technology** | Redis |
| **Purpose** | Cache expensive AI predictions (AI-Analytics) & WebSocket Pub/Sub for chat (CRM) |
| **Status** | **NEW** – Provisioned |
| **Access** | CRM & AI-Analytics (Read/Write) |

**Screenshots**
*[Insert Screenshot 3: RedisInsight showing connected database]*

**Connection Setup (C# and Python):**
```csharp
// api-crm/Program.cs
builder.Services.AddSignalR()
    .AddStackExchangeRedis($"{redisHost}:{redisPort}");
```
```python
# api-ai-analytics/app/main.py
logger.info("Connecting to Redis at %s", settings.redis_url)
await connect_redis(settings.redis_url)
```

---

### 1.5 Polyglot Persistence Summary

| Database # | Technology | Type | Purpose | Status | Access |
|---|---|---|---|---|---|
| **1** | PostgreSQL | Relational (OLTP) | Operational CRM data (Source of Truth) | ✅ Running | CRM (R/W) |
| **2** | MongoDB | Document Store | ML Feature Logging | ✅ Running | AI-Analytics (R/W) |
| **3** | Redis | Key-Value Cache | AI Result Caching & Real-Time Pub/Sub | ✅ Running | Both (R/W) |
