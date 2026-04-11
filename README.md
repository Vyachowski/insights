# Insights

Monorepo for a **business analytics dashboard**: goals, centralized data ingestion, and recurring metric reviews for owners and analysts.

Product areas:

- Goal tracking
- Financial health
- SEO performance
- Data import and refresh

## Stack

| Layer | Technologies |
|-------|----------------|
| **API** | [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), PostgreSQL |
| **Client** | [React](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [React Router](https://reactrouter.com/) |
| **Shared** | `packages/contracts` |
| **Production** | [Railway](https://railway.app/) for API and database; frontend static hosting as you prefer |

## Repository layout

```
insights/
├── apps/
│   ├── backend/      # NestJS, Prisma, REST API (/api/v1/...)
│   └── frontend/     # SPA (Vite + React)
├── packages/
│   └── contracts/    # Shared types and contracts
├── package.json      # npm workspaces, root scripts
└── README.md
```

Server-specific notes: [apps/backend/README.md](apps/backend/README.md).

## Requirements

- **Node.js** (LTS) and **npm**
- **Docker** for local PostgreSQL (Compose)

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

See **[apps/.env.example](apps/.env.example)** for backend and Docker Compose variables. Copy it to **`apps/.env.dev`** (same path the tooling expects).

See **[apps/frontend/.env.example](apps/frontend/.env.example)** for the SPA. Copy it to **`apps/frontend/.env`**.

### 3. Database

From the repository root:

```bash
npm run dev:up --workspace @insights/backend
```

Run Prisma migrations (and seeds if needed) using the backend workspace — see [apps/backend/README.md](apps/backend/README.md).

### 4. Run backend and frontend

```bash
npm run dev
```

Or separately:

```bash
npm run backend:dev
npm run frontend:dev
```

## Build

```bash
npm run backend:build
npm run frontend:build
```

## Deployment (Railway)

Production target is **Railway**: managed PostgreSQL, a Node service for Nest (build, `prisma migrate deploy` on start, env vars from Railway). A separate step-by-step guide can be added later.

## License

UNLICENSED (private).
