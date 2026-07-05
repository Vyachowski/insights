# Insights — developer reference

Business analytics dashboard for site owners and analysts. Tracks revenue, expenses, SEO metrics, and call data across a portfolio of sites grouped by city.

See `openspec/specs/` for the capability specs: app layout & data model, backend/frontend architecture, API conventions, and development workflow.

See @AGENTS.md for communication style.

## Git conventions

Full engineering workflow (testing, linting, git hooks, commits) is specified in `openspec/specs/development-workflow`. Essentials, repeated here since this file is always loaded:

- Solo-dev project: commit directly to `main`. Don't create feature branches unless explicitly asked.
- Conventional Commits (`type(scope): short description`), enforced by commitlint; keep each commit atomic and non-breaking.
- Never add AI attribution to commits, PRs, or any other text — no `Co-Authored-By: Claude`, no "Generated with Claude Code", no 🤖 markers, no similar trailers or mentions.

## Dev commands

```bash
npm run dev     # backend + frontend concurrently
npm run lint    # lint both workspaces
npm run knip    # find unused files/exports/deps repo-wide

# per app: run from repo root with -w, or cd into apps/backend | apps/frontend
npm run dev -w @insights/backend         # backend only (runs prisma generate first)
npm run dev -w @insights/frontend        # frontend only
npm run build -w @insights/backend
npm run build -w @insights/frontend

# backend workspace
npm run dev:up -w @insights/backend          # start Postgres via Docker Compose
npm run prisma:migrate -w @insights/backend  # apply migrations
```

Fresh database bootstrap: users, cities, and sites are created automatically on app startup from env config (`ADMIN_*`/`USER_*` vars, `CITIES_CSV_URL`/`SITES_CSV_URL`); data CSVs (calls, revenue, expenses, metrics) are uploaded via the frontend import UI.

Env files: `apps/backend/.env.dev` (copy from `.env.example`), `apps/frontend/.env` (copy from `.env.example`).

## Known constraints (frontend)

- **`DashboardPage` сам инициирует загрузку данных** — `useEffect` с `dispatch(fetchDashboardSummary())` внутри компонента. Правильное решение — React Router `loader`, но требует миграции с `BrowserRouter` на `createBrowserRouter`. Отложено.
