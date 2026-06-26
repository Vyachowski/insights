# Insights: Application-Wide Specification

> **Last Updated**: 2026-06-26

This document defines the global architecture, data models, conventions, and guidelines for the **Insights** business analytics monorepo.

---

## 1. Why (Business Goal)
Business owners and analysts need a single dashboard to track the performance of a portfolio of sites grouped by city. They need to monitor SEO performance metrics, call leads, financial health (revenue/expenses), and manage goals.

---

## 2. What (Core Capabilities)
- **Goal Tracking** *(planned)*: Set and monitor performance targets.
- **Financial Health**: Record and view monthly revenue and expenses at both company and site levels.
- **SEO Performance**: Track Yandex and Google user visits, bounce rates, and duration per day per site.
- **Data Ingestion**: Import call data from CSV sheets and receive real-time webhook calls (Gudok).

---

## 3. Tech Stack & Repository Layout
The project is a monorepo managed with npm workspaces:

```
insights/
├── apps/
│   ├── backend/      # NestJS REST API
│   └── frontend/     # SPA (React, Vite, Mantine UI, Redux Toolkit)
├── packages/
│   └── contracts/    # Shared TypeScript contracts (API types and payloads)
├── specs/
│   └── README.md     # This app-wide specification
├── commitlint.config.mjs  # Conventional Commits rules (commit-msg hook)
└── package.json      # Workspace root config + git hooks, lint-staged
```

### 3.1 Backend Stack
- **Framework**: NestJS (Standard Module-Controller-Service pattern).
- **ORM**: Prisma connecting to PostgreSQL. Schema path: `apps/backend/src/prisma/schema.prisma`.
- **Validation**: Zod (auto-generated from Prisma schemas via `prisma-zod-generator`).
- **Documentation**: Swagger via custom `@ApiWrappedResponse` decorators.

### 3.2 Frontend Stack
- **Bundler & Tooling**: Vite + React.
- **UI & Styling**: [Mantine UI](https://mantine.dev/) component library.
- **State Management**: Redux Toolkit.
- **HTTP Client**: Axios with `withCredentials: true` (cookies).

---

## 4. Global Data Model

The database contains the following entities:

```
User (email, password, role, status)           ← standalone, no FK to other entities

City (code [unique], name, slug, population)
 └── Site (name, group, url, counter IDs)
      ├── SiteMetric (SEO metrics per day: users, duration, bounce, leads — split by Yandex/Google/Other)
      ├── Call (Gudok webhook calls: gudokId, projectId, dst, src, duration, billsec, callstatus, region, audio)
      ├── CallImport (raw CSV rows before merge: src, callNumber, class, advChannelName, billsec)
      ├── Revenue (monthly amount, date, optional siteId — unique per [date, siteId])
      └── Expense (type, amount, date, comment, optional siteId — unique per [date, siteId, type])
```

### 4.1 Key Schema Constraints
- `Site` is the central roll-up entity. 
- Aggregates (SEO, finance, calls) roll up to `City`.
- `Revenue` and `Expense` have an optional `siteId`. A null value denotes a company-level financial entry.
- Unique indexes prevent duplicate entries (e.g., `Revenue` is unique per `[date, siteId]`).

---

## 5. Database & Migrations
- **Engine**: PostgreSQL, run locally via `docker-compose.dev.yml` (`npm run dev:up -w @insights/backend`).
- **Schema**: `apps/backend/src/prisma/schema.prisma` is the single source of truth for tables, columns, and relations.
- **Migrations**: `npm run db:migrate -w @insights/backend` (dev, creates+applies) generates files under `apps/backend/src/prisma/migrations/`. In production, `start:prod` runs `prisma migrate deploy` before the server boots — migrations are never applied manually on deploy targets.
- **Seeding**: `apps/backend/src/prisma/seed/` + `npm run db:seed -w @insights/backend` (wraps `prisma db seed`). Seeds an admin and a regular user from `ADMIN_*` / `USER_*` env vars (see `.env.example`).
- **Reset**: `prisma:reset` (backend workspace) drops and recreates the dev database — destructive, dev-only.

---

## 6. Backend Architecture
Each domain is a self-contained NestJS module under `apps/backend/src/<domain>/` (e.g. `revenue/`, `calls/`, `metrics/`):

```
<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts      # routes, decorators, Swagger
├── <domain>.service.ts         # business logic, Prisma calls
├── <domain>.controller.spec.ts
├── <domain>.service.spec.ts
└── dto/                        # create/update/response DTOs (Zod-validated)
```

Cross-cutting concerns live in `apps/backend/src/common/`:
- `guards/` — `JwtAuthGuard`, `LocalAuthGuard`, `AdminGuard`.
- `decorators/` — `@CurrentUser()`, `@ApiWrappedResponse()`.
- `interceptors/` — `ResponseInterceptor` (wraps every success response in `{ data: T }`).
- `filters/` — `AllExceptionsFilter` (wraps every error in `{ error: { code, message, details? } }`).

`apps/backend/src/database/` holds `PrismaService` (injected into services); `apps/backend/src/config/` holds env validation (`validation.config.ts`), consumed via `ConfigModule`.

### 6.1 API & Security Conventions
- **Base Route**: `/api/v1/`.
- **Authentication**: JWT stored in an `httpOnly` cookie named `access_token`; issued on `POST /auth/login`, cleared on `POST /auth/logout`.
- **Response Wrapper**: every successful response is `{ data: T }`; every error is `{ error: { code, message, details? } }` — both typed in `packages/contracts/api.types.ts`.
- **Health**: `GET /health` (`@nestjs/terminus`) checks heap memory and a `SELECT 1` DB round-trip; used for platform health checks.

---

## 7. Frontend Architecture
`apps/frontend/src/` is layered so each piece has one job. Data flows in one direction:

```
api/          → axios calls per domain (auth.ts, revenue.ts, calls.ts, …)
store/thunks/ → createAsyncThunk per domain; calls api/, dispatches slice actions
store/slices/ → RTK reducers; own the normalized state shape
store/selectors/ → all reads go through selectors, never raw state.<slice>.<field>
hooks/        → bridges Redux + cross-cutting concerns into components (useAuth, useAppInit, useProgressiveMetrics)
pages/ + components/ → composition and rendering
```

- **Selectors are mandatory for reads.** Components and hooks must read state via `store/selectors/*Selectors.ts`, not by reaching into `useSelector(state => state.slice...)` directly — keeps state-shape changes isolated to one file per slice.
- **Container / View split**: complex page sections are split into a container and a presentational view, e.g. `pages/DataPage/tabs/RevenueTab.tsx` (container — selectors, thunks, dispatch, loading/error state) and `RevenueTabView.tsx` (view — props in, JSX out, no Redux). Apply this split whenever a tab/widget needs both data-fetching and non-trivial rendering; simple widgets can stay a single component.
- **Page structure**: feature pages (`pages/DashboardPage/`, `pages/DataPage/`) follow `index.tsx` (export) → `page/` (top-level page component) → `components/` (page-local widgets) → `skeletons/` (loading states, used with `components/hoc/withSkeleton.tsx`).
- **Routing**: `router/` defines routes; `<ProtectedRoute>` / `<GuestRoute>` (`components/guards/`) gate access based on `authSlice` state.

---

## 8. Testing
- **Backend**: unit tests are colocated with source as `*.spec.ts` (e.g. `apps/backend/src/revenue/revenue.service.spec.ts`); run via `npm test` (jest) from the backend workspace. `apps/backend/test/` holds only the e2e suite (`app.e2e-spec.ts`, `jest-e2e.json`).
- **Contracts**: Shared types in `packages/contracts/` should be validated against Zod schemas generated by Prisma.

---

## 9. Deployment
- **Target**: Railway (managed Postgres + Node service for the backend).
- **Backend**: `start:prod` runs `prisma migrate deploy` then starts `dist/src/main.js` — migrations are applied automatically on every deploy, never run manually against production.
- **Frontend**: built as a static bundle (`frontend:build`) and hosted separately from the API.
- **Config**: all runtime config is via env vars (`apps/backend/.env.example`); secrets (`JWT_SECRET`, `YANDEX_API_OAUTH_TOKEN`, DB credentials) are set on the platform, never committed.

---

## 10. Development Workflow
1. **Define Contract**: Add new DTO and API interface types to `packages/contracts/`.
2. **Implement Backend**: Update the database schema if needed, run Prisma migrations, write NestJS routes, and add validation.
3. **Implement Frontend**: Add an `api/` call, a thunk, slice state, a selector, then wire it into a container component (or hook) and its view.

---

## 11. Code Quality & Tooling

Quality is enforced by two layers: per-workspace **ESLint** (the rules) and root-level **git hooks** (the gate that runs them). Configs are intentionally kept per-workspace — there is no shared base config — because the backend and frontend have different formatting strategies and rule sets.

### 11.1 Linting

Each app owns a flat ESLint 9 config; lint the whole repo with `npm run lint` from the root (fans out to both workspaces).

- **Backend** (`apps/backend/eslint.config.mjs`): `typescript-eslint` **type-aware** preset (`recommendedTypeChecked`) — catches `no-floating-promises`, `no-unsafe-argument`, etc. via the TS type-checker (`projectService: true`). Formatting is delegated to **Prettier** (`eslint-plugin-prettier`, errors on violation). `no-explicit-any` is intentionally off (NestJS/Prisma interop).
- **Frontend** (`apps/frontend/eslint.config.js`): `typescript-eslint` `recommended` (not type-aware) plus `react-hooks`, `react-refresh`, `import`, and `unused-imports`. Formatting is handled by **`@stylistic`** rules, not Prettier — notably **no semicolons**, single quotes, 2-space indent, trailing commas. Imports are grouped and alphabetized (`import/order`); `consistent-type-imports` enforces `import type`.
- **Shared convention**: `max-lines-per-function` warns at 25 lines (off for `.tsx`, where JSX inflates length). Unused vars are allowed only with a leading underscore.

> **Known divergence**: backend uses Prettier, frontend uses `@stylistic`; the frontend's `import/order` / `no-console` hygiene rules are not mirrored on the backend. Accepted for now — unifying would mean a shared `packages/eslint-config`, which is overkill for two consumers. Revisit if a third workspace appears.

ESLint is the single source of truth for linting. **oxlint is deliberately not used**: it cannot run the type-aware backend rules, and a second linter config is not worth maintaining for a project this size.

### 11.2 Git hooks

Driven by **`simple-git-hooks`** (config in root `package.json`), activated on `npm install` via the `prepare` script. After a fresh clone, run `npx simple-git-hooks` once to install them.

- **`pre-commit`** → `npx lint-staged`. `lint-staged` runs `eslint --fix` on **staged files only**, routed to the correct workspace config by path glob (`apps/backend/**/*.ts`, `apps/frontend/**/*.{ts,tsx}`). Fast — it never lints the whole tree.
- **`commit-msg`** → `npx commitlint --edit` validates the message.

### 11.3 Commit messages

Enforced by **commitlint** (`commitlint.config.mjs`, extends `@commitlint/config-conventional`). Every commit must follow **Conventional Commits** (`type(scope): subject`); type is required, scope is free-form (not restricted to a fixed list). This is the machine-checked counterpart to the Git conventions in `CLAUDE.md`.

> Hooks gate *local* commits only. If CI is added later, `npm run lint` should run there as the backstop.
