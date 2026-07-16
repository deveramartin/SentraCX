<div align="center">

# SentraCX

**S**mart **EN**gagement **T**icketing **R**elationship and **A**nalytics — **CX**

[![Status](https://img.shields.io/badge/status-under%20development-yellow)](https://github.com/your-org/sentracx)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, AI-powered customer experience and relationship management platform.

</div>

---

## Overview

SentraCX is a monorepo containing three core applications:

| App | Description | Port | Tech Stack |
|-----|-------------|------|------------|
| **web-crm** | CRM web frontend | `3005` | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| **api-crm** | CRM backend API | `5005` | .NET 10, Entity Framework Core |
| **api-ai-analytics** | AI & analytics service | `4005` | FastAPI, Pydantic, MongoDB |

## Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v9+
- [.NET SDK](https://dotnet.microsoft.com/) 10.0+
- [Python](https://www.python.org/) 3.12+
- [PostgreSQL](https://www.postgresql.org/) v15+ (for api-crm)
- [MongoDB](https://www.mongodb.com/) 7+ (for api-ai-analytics)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/sentracx.git
   cd SentraCX
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/web-crm/.env.example apps/web-crm/.env.local
   cp apps/api-crm/appsettings.Development.json apps/api-crm/appsettings.Local.json
   ```

4. **Run all services in development mode**

   ```bash
   pnpm dev
   ```

## Scripts

All scripts are run from the monorepo root with `pnpm <script>`.

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in parallel |
| `pnpm dev:web` | Start web-crm (Next.js) on port 3005 |
| `pnpm dev:api` | Start api-crm (.NET) on port 5005 |
| `pnpm dev:ai` | Start api-ai-analytics (FastAPI) on port 4005 |

### Build

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all apps in parallel |
| `pnpm build:web` | Build web-crm |
| `pnpm build:api` | Build api-crm |
| `pnpm build:ai` | Build api-ai-analytics |

### Production

| Command | Description |
|---------|-------------|
| `pnpm start` | Start all apps in production mode |
| `pnpm start:web` | Start web-crm production server |
| `pnpm start:api` | Start api-crm production server |
| `pnpm start:ai` | Start api-ai-analytics production server |

### Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Lint all workspaces |
| `pnpm lint:web` | Lint web-crm |
| `pnpm test` | Run all test suites |
| `pnpm test:api` | Run api-crm tests |
| `pnpm test:ai` | Run api-ai-analytics tests |
| `pnpm clean` | Remove all build artifacts & node_modules |

## Project Structure

```
SentraCX/
├── apps/
│   ├── web-crm/              # Next.js frontend (port 3005)
│   ├── api-crm/              # .NET Web API (port 5005)
│   └── api-ai-analytics/     # FastAPI service (port 4005)
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── config/               # Shared configuration
│   └── types/                # Shared TypeScript types
├── docs/                     # Documentation
├── docker/                   # Docker compose files
├── pnpm-workspace.yaml       # Workspace configuration
├── turbo.json                # Turborepo pipeline config
└── package.json              # Root scripts
```

## Docker

Run all services with Docker Compose:

```bash
docker compose -f docker/docker-compose.ci.yml up --build
```

## License

This project is licensed under the [MIT License](LICENSE).
