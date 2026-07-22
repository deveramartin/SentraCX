# SentraCX Deployment Plan

> **Scope** — production deployment of all three independently deployable services:
> `web-crm` (Next.js), `api-crm` (.NET 10), and `api-ai-analytics` (Python/FastAPI),
> plus every data store they depend on.

---

## 1. Architecture Overview

```
                         ┌─────────────────────────────────┐
                         │         Load Balancer / CDN      │
                         │        (e.g. Cloudflare / ALB)   │
                         └────────────┬────────────────────-┘
                                      │ HTTPS
                         ┌────────────▼────────────┐
                         │       web-crm            │
                         │   Next.js 16 (Node)      │
                         │   port 3005              │
                         └────────┬────────┬────────┘
                                  │        │ REST
                          REST    │        └──────────────────────────┐
                                  │                                   │
               ┌──────────────────▼──────────┐       ┌───────────────▼────────────┐
               │         api-crm              │       │      api-ai-analytics       │
               │    .NET 10 Web API           │       │   FastAPI (Python 3.12)     │
               │    port 5005                 │       │   port 4005                 │
               │                              │       │                             │
               │  ┌──────────┐ ┌──────────┐  │       │  ┌───────────┐ ┌────────┐  │
               │  │PostgreSQL│ │  Redis   │  │       │  │  MongoDB  │ │ Redis  │  │
               │  │ (EF Core)│ │(SignalR) │  │       │  │(features/ │ │(cache) │  │
               │  └──────────┘ └──────────┘  │       │  │transcripts│ └────────┘  │
               │                              │       │  └───────────┘             │
               └──────────────────────────────┘       └────────────────────────────┘
                                  │  REST API calls
                                  └────────────────────► api-crm
```

---

## 2. Redis — Do We Need It in the CRM?

**Yes. Redis is required in `api-crm`.** It is not optional.

The CRM uses `Microsoft.AspNetCore.SignalR.StackExchangeRedis` as a **backplane**
for the `ChatHub` (real-time ticket support chat). Without Redis, SignalR messages
only reach clients connected to the *same server instance*. With Redis Pub/Sub as
the backplane, any number of CRM replicas can broadcast to all connected clients.

| Service | Redis role | Required? |
|---|---|---|
| `api-crm` | SignalR Pub/Sub backplane (WebSocket chat) | ✅ Yes — mandatory for multi-instance |
| `api-ai-analytics` | TTL insight cache (`customer_cache_repository`, `ticket_sentiment_repository`) | ✅ Yes — cache layer |

You can run a **single shared Redis instance** for both services (separate logical
databases: `redis://…/0` for AI-analytics, `redis://…/1` for CRM SignalR), or two
separate instances. The shared approach is simpler and cheaper at small scale;
separate instances give better isolation and independent scaling.

---

## 3. Services & Ports

| Service | Runtime | Internal Port | Exposed via |
|---|---|---|---|
| `web-crm` | Node.js 22 LTS | 3005 | Reverse proxy / CDN |
| `api-crm` | .NET 10 | 5005 | Reverse proxy (HTTPS) |
| `api-ai-analytics` | Python 3.12 + Uvicorn | 4005 | Internal only |
| PostgreSQL | Postgres 16 | 5432 | Internal only |
| MongoDB | MongoDB 7 | 27017 | Internal only |
| Redis | Redis 7 | 6379 | Internal only |
| Auth Service (`authservice`) | External OIDC | 5001 | Internal / separate deploy |

---

## 4. Container Strategy (Docker)

Each service gets its own `Dockerfile`. A root-level `compose/` folder holds a
`docker-compose.yml` for standing up all services together.

### 4.1 `api-crm` Dockerfile (multi-stage, .NET 10)

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY apps/api-crm/ .
RUN dotnet publish Crm.Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5005
EXPOSE 5005
ENTRYPOINT ["dotnet", "Crm.Api.dll"]
```

> TLS is terminated at the load balancer. The container listens on plain HTTP internally.

### 4.2 `api-ai-analytics` Dockerfile (Python 3.12)

```dockerfile
FROM python:3.12-slim AS runtime
WORKDIR /app
COPY apps/api-ai-analytics/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/api-ai-analytics/ .
ENV APP_ENV=production
EXPOSE 4005
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4005", "--workers", "2"]
```

### 4.3 `web-crm` Dockerfile (Next.js standalone output)

Enable Next.js standalone output first — add to `apps/web-crm/next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
};
```

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY apps/web-crm/package.json apps/web-crm/pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web-crm/ .
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3005
CMD ["node", "server.js"]
```

### 4.4 `docker-compose.yml` (full stack)

```yaml
# compose/docker-compose.yml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sentracx_crm
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine

  api-crm:
    build:
      context: ..
      dockerfile: apps/api-crm/Dockerfile
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: sentracx_crm
      DATABASE_USER: ${DB_USER}
      DATABASE_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_AUTHORITY: ${JWT_AUTHORITY}
      JWT_AUDIENCE: sentracx-crm-api
      FILE_STORAGE_PROVIDER: S3
      AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}
    depends_on: [postgres, redis]
    ports:
      - "5005:5005"

  api-ai-analytics:
    build:
      context: ..
      dockerfile: apps/api-ai-analytics/Dockerfile
    environment:
      MONGO_URI: mongodb://mongo:27017
      MONGO_DATABASE: sentracx_analytics
      REDIS_URL: redis://redis:6379/1
      CRM_API_BASE_URL: http://api-crm:5005
      CRM_SERVICE_TOKEN: ${CRM_SERVICE_TOKEN}
      GROQ_API_KEY: ${GROQ_API_KEY}
      GROQ_MODEL_ID: llama-3.1-8b-instant
      JWT_SECRET: ${JWT_SECRET}
      JWT_ISSUER: ${JWT_AUTHORITY}
    depends_on: [mongo, redis, api-crm]
    ports:
      - "4005:4005"

  web-crm:
    build:
      context: ..
      dockerfile: apps/web-crm/Dockerfile
    environment:
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_URL: ${WEB_BASE_URL}
      AUTH_CRMS_CLIENT_ID: ${OIDC_CLIENT_ID}
      AUTH_CRMS_CLIENT_SECRET: ${OIDC_CLIENT_SECRET}
      AUTH_ISSUER: ${JWT_AUTHORITY}
      NEXT_PUBLIC_CRM_API_URL: ${CRM_API_PUBLIC_URL}
    depends_on: [api-crm]
    ports:
      - "3005:3005"

volumes:
  postgres_data:
  mongo_data:
```

---

## 5. Environment Variables (Production Reference)

### `api-crm`

| Variable | Description |
|---|---|
| `DATABASE_HOST` | PostgreSQL host |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `sentracx_crm` |
| `DATABASE_USER` | DB username |
| `DATABASE_PASSWORD` | DB password — inject from secret manager |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | `6379` |
| `JWT_AUTHORITY` | OIDC issuer URL |
| `JWT_AUDIENCE` | `sentracx-crm-api` |
| `FILE_STORAGE_PROVIDER` | `S3` in prod |
| `AWS_BUCKET_NAME` | S3 bucket name |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

### `api-ai-analytics`

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `MONGO_DATABASE` | `sentracx_analytics` |
| `REDIS_URL` | `redis://host:6379/1` (DB 1 — separate from CRM) |
| `CRM_API_BASE_URL` | Internal URL of `api-crm` |
| `CRM_SERVICE_TOKEN` | Service-to-service auth token |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL_ID` | `llama-3.1-8b-instant` |
| `JWT_SECRET` | JWT signing secret |
| `JWT_ISSUER` | OIDC issuer URL |
| `APP_ENV` | `production` |

### `web-crm`

| Variable | Description |
|---|---|
| `AUTH_SECRET` | NextAuth.js secret (min 32 bytes) |
| `AUTH_URL` | Public URL of the web app |
| `AUTH_CRMS_CLIENT_ID` | OIDC client ID |
| `AUTH_CRMS_CLIENT_SECRET` | OIDC client secret |
| `AUTH_ISSUER` | OIDC issuer URL |
| `NEXT_PUBLIC_CRM_API_URL` | Browser-accessible URL of `api-crm` |
| `NODE_ENV` | `production` |

---

## 6. Database Considerations

### PostgreSQL (CRM)

- Run EF Core migrations on startup in **staging/dev** (already wired in `Program.cs`).
- In **production**, run migrations as a separate init container or pre-deploy job —
  never auto-migrate in production containers.
- Enable connection pooling via **PgBouncer** if running multiple CRM replicas.
- Enable automated backups with point-in-time restore.

### MongoDB (AI Analytics)

- Use **MongoDB Atlas** (managed) in production, or deploy a 3-node replica set.
- Collections: `customer_features` (ML input), `conversation_transcripts`.
- No schema migrations — Pydantic models serve as the schema contract.

### Redis (Shared)

- Use a single Redis 7 instance with two logical databases:
  - `DB 0` — AI-Analytics TTL cache
  - `DB 1` — CRM SignalR Pub/Sub backplane
- Enable `AOF` persistence if WebSocket session durability matters during restarts.
- In cloud: use **Upstash** (serverless), **ElastiCache**, or **Cloud Memorystore**.

---

## 7. Reverse Proxy / Ingress

Use **Nginx** or a cloud load balancer (AWS ALB, GCP Load Balancer) in front of all services.

Suggested domain routing:

| Hostname | Upstream |
|---|---|
| `app.yourdomain.com` | `web-crm:3005` |
| `api.yourdomain.com` | `api-crm:5005` |
| `ai-internal.yourdomain.com` | `api-ai-analytics:4005` (internal only) |

**SignalR WebSocket config** (Nginx):

```nginx
location /hubs/ {
    proxy_pass         http://api-crm:5005;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 3600;
}
```

---

## 8. Cloud Deployment Options

### Option A — Managed Kubernetes (GKE / EKS / AKS)

Best for: production at scale, independent autoscaling per service.

- Each service → a `Deployment` + `Service` + `HorizontalPodAutoscaler`.
- PostgreSQL → **Cloud SQL** (GCP) or **RDS** (AWS).
- MongoDB → **MongoDB Atlas**.
- Redis → **Cloud Memorystore** (GCP) or **ElastiCache** (AWS).
- Secrets via Kubernetes `Secret` + GCP Secret Manager / AWS Secrets Manager.

### Option B — Docker Compose on a VPS (Hetzner / DigitalOcean)

Best for: early-stage / low-budget.

- Single `docker-compose.yml` with all services on one host.
- Nginx as a reverse proxy container.
- GitHub Actions deploys via `docker compose pull && docker compose up -d`.
- Persistent volumes for Postgres and Mongo data.

### Option C — Platform-as-a-Service

Best for: lowest ops overhead.

| Service | Platform |
|---|---|
| `web-crm` | **Vercel** (native Next.js, zero config) |
| `api-crm` | **Railway** / Render / Azure App Service |
| `api-ai-analytics` | **Railway** / Google Cloud Run |
| PostgreSQL | **Neon** / Supabase / Railway |
| MongoDB | **MongoDB Atlas** |
| Redis | **Upstash** |

---

## 9. CI/CD Pipeline (GitHub Actions)

```
Trigger: push to main / PR merge
│
├── Lint + test (parallel)
│   ├── pnpm test:web      (Jest + Playwright)
│   ├── dotnet test        (api-crm unit + integration)
│   └── pytest             (api-ai-analytics)
│
├── Build Docker images
│   ├── ghcr.io/org/sentracx-web-crm:{sha}
│   ├── ghcr.io/org/sentracx-api-crm:{sha}
│   └── ghcr.io/org/sentracx-api-ai-analytics:{sha}
│
├── Push to container registry
│
├── Run DB migrations  ← separate job, completes before app rollout
│   └── dotnet ef database update (api-crm)
│
└── Rolling deploy (zero-downtime)
    ├── staging  → automatic
    └── production → manual approval gate
```

---

## 10. Secrets Management

- **Never commit secrets.** All `.env.local` and `.env` files are gitignored.
- In production, inject secrets at runtime via:
  - **AWS Secrets Manager** / **GCP Secret Manager** / **HashiCorp Vault**
  - Or CI/CD environment variable injection (GitHub Actions Secrets → container env).
- Rotate `AUTH_SECRET`, `CRM_SERVICE_TOKEN`, and `GROQ_API_KEY` on a schedule.
- Generate `AUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```

---

## 11. Health Checks

| Service | Endpoint | Expected response |
|---|---|---|
| `api-crm` | `GET /health` *(add if missing)* | `200 OK` |
| `api-ai-analytics` | `GET /health` | `{"status": "healthy"}` |
| `web-crm` | `GET /api/health` *(Next.js route, add if missing)* | `200 OK` |

Configure as Docker `HEALTHCHECK` instructions and Kubernetes liveness/readiness probes.

---

## 12. Open Questions / Decisions Needed

| # | Question | Impact |
|---|---|---|
| 1 | **Shared vs. separate Redis?** One instance (DB 0/1) vs. two isolated instances. | Ops complexity, cost |
| 2 | **Auth service (`authservice`)** — how is this deployed? Referenced in all OIDC config but absent from this repo. | Blocking for any deployment |
| 3 | **File storage** — S3 provider is coded but bucket/credentials are not documented anywhere. | `api-crm` file uploads in prod |
| 4 | **`NEXT_PUBLIC_CRM_API_URL`** — should the frontend call `api-crm` directly (browser → API) or proxy through Next.js API routes? | CORS surface, credential exposure |
| 5 | **EF Core migrations in prod** — init container, pre-deploy job, or a dedicated migration service? | Zero-downtime rollouts |
| 6 | **pgvector** — planned but not yet implemented. When it lands, PostgreSQL needs the `pgvector` extension pre-enabled. | Future migration planning |
