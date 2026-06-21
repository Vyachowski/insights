# Insights — developer reference

Business analytics dashboard for site owners and analysts. Tracks revenue, expenses, SEO metrics, and call data across a portfolio of sites grouped by city.

See `specs/README.md` for the full architecture spec: repository layout, data model, API conventions, backend/frontend architecture, database, and deployment.

See `AGENTS.md` for communication style.

## Dev commands

```bash
npm run dev            # backend + frontend concurrently
npm run backend:dev    # backend only (runs prisma generate first)
npm run frontend:dev   # frontend only

# backend workspace
npm run dev:up -w @insights/backend      # start Postgres via Docker Compose
npm run db:migrate -w @insights/backend  # apply migrations
npm run db:seed -w @insights/backend     # seed data
```

Env files: `apps/backend/.env.dev` (copy from `.env.example`), `apps/frontend/.env` (copy from `.env.example`).

## Known constraints (frontend)

- **`DashboardPage` сам инициирует загрузку данных** — `useEffect` с `dispatch(fetchDashboardSummary())` внутри компонента. Правильное решение — React Router `loader`, но требует миграции с `BrowserRouter` на `createBrowserRouter`. Отложено.
