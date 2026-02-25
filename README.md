# 🦷 Molave — Dental Practice Management System

Full-stack monorepo: React+Vite UI · Supabase (PostgreSQL) · Redis

---

## Architecture

```
apps/
  api/       NestJS REST API + Socket.IO gateway
  web/       React + Vite + TanStack Query
  workers/   BullMQ job processors
packages/
  types/     Shared Zod schemas + TypeScript DTOs
```

**Data flow:**
```
FE (TanStack Query)
      │  REST + WebSocket
      ▼
NestJS API  ──────────►  BullMQ Queue (Redis)
      │                         │
      │◄── Redis pub/sub ───  Worker
      │                         │
      ▼                         ▼
 Socket.IO → FE refetch      DB Update (PostgreSQL)
```

---

## Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 8  (`npm i -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Start infrastructure

```bash
docker-compose up -d   # PostgreSQL + Redis
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/workers/.env.example apps/workers/.env
```

Edit `apps/api/.env` — the defaults match the docker-compose config.

### 5. Start the local Supabase stack

```bash
pnpm supabase:start
```

### 6. Start the web app

```bash
pnpm dev
```

| Service  | URL                        |
|----------|----------------------------|
| Web UI   | http://localhost:5173       |
| API      | http://localhost:3000/v1    |
| Health   | http://localhost:3000/health|

---

## API Reference

All endpoints require `Authorization: Bearer <token>` except auth routes.

### Auth
| Method | Path              | Body                              |
|--------|-------------------|-----------------------------------|
| POST   | /v1/auth/register | `{ name, email, password }`       |
| POST   | /v1/auth/login    | `{ email, password }`             |

### Patients
| Method | Path               | Notes              |
|--------|--------------------|--------------------|
| GET    | /v1/patients       | List all           |
| GET    | /v1/patients/:id   | With appointments  |
| POST   | /v1/patients       |                    |
| PATCH  | /v1/patients/:id   |                    |
| DELETE | /v1/patients/:id   |                    |

### Appointments
| Method | Path                          | Notes                              |
|--------|-------------------------------|------------------------------------|
| GET    | /v1/appointments              | List all                           |
| GET    | /v1/appointments/:id          | With patient + jobs                |
| POST   | /v1/appointments              | Enqueues confirmation job          |
| PATCH  | /v1/appointments/:id          | Change status etc.                 |
| DELETE | /v1/appointments/:id          |                                    |
| POST   | /v1/appointments/:id/reminder | Enqueue reminder job → live update |

### Jobs
| Method | Path        |
|--------|-------------|
| GET    | /v1/jobs    |
| GET    | /v1/jobs/:id|

### Health
| Method | Path    |
|--------|---------|
| GET    | /health |

---

## Realtime Events (Socket.IO)

Connect with JWT: `io('/', { auth: { token } })`

| Event               | Payload                                     | Trigger                    |
|---------------------|---------------------------------------------|----------------------------|
| `job:update`        | `{ jobId, status, type, appointmentId }`    | Worker finishes/fails      |
| `appointment:update`| `{ appointmentId, status }`                 | Appointment status changes |

The FE uses these events to call `queryClient.invalidateQueries()` so the UI updates without polling.

---

## Package scripts

```bash
pnpm dev              # Start the web app
pnpm dev:web          # Start the web app only
pnpm build            # Build all packages
pnpm supabase:start   # Start local Supabase
pnpm supabase:deploy  # Deploy Supabase functions
```

---

## Phase roadmap

| Phase | Goal                     | Status  |
|-------|--------------------------|---------|
| 1     | Foundation (REST + DB)   | ✅ Done |
| 2     | Async + Realtime         | ✅ Done |
| 3     | Hardening (auth WS, DLQ) | 🔜      |
| 4     | Scale prep               | 🔜      |
