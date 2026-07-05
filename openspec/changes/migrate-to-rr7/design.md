# Design: migrate-to-rr7

## Context

Two apps joined by REST: NestJS backend (~2.7k lines, 11 modules, Prisma 7, passport JWT-cookie auth, Swagger) and React 19 SPA (~3.5k lines, Redux Toolkit, axios, recharts; pages: Login, Dashboard, Data, 404; route guards Guest/Protected). Shared `contracts/` (160 lines of TS types). Deployed as one Railway service (backend) + static frontend. `remove-seed` already made the DB fully re-creatable: startup bootstrap (users/cities/sites from env) + CSV uploads for data tables.

Constraints:

- Solo maintainer; boring, well-documented choices preferred.
- Data is disposable pre-prod: drop → migrate → bootstrap → re-upload is an accepted reset path.
- Existing argon2 hashes and env vars (`JWT_SECRET`, `ADMIN_*`/`USER_*`, `*_CSV_URL`, `DATABASE_URL`) must keep working.
- React components (charts, tables, layouts, skeletons) should port with minimal edits.

## Goals / Non-Goals

**Goals:**

- One flat repo, one package.json, one Railway service, one dev command.
- Server data flows through loaders/actions only — no fetch layer, no client-side server-state store.
- Drizzle as the query layer; schema as TS; zero codegen.
- Hand-rolled cookie-session auth (~100 lines), argon2 hashes unchanged.

**Non-Goals:**

- No visual/UX changes; pages look and behave the same.
- No new features during migration (strangler discipline: port, verify, delete).
- No SSR-for-SEO work (app is behind login; SSR is just how RR7 serves the shell).
- No i18n, no test-suite overhaul beyond porting what exists.

## Decisions

### 1. Strangler migration in-place, flatten at cutover

The RR7 app is scaffolded at `apps/web` alongside the existing workspaces and ported page-by-page against the same dev database. Cutover = delete `apps/backend`, `apps/frontend`, `contracts/`, then flatten `apps/web` to the repo root (single package.json, workspaces removed). Rationale: keeps the old app runnable for visual comparison until the last commit; the flatten is a pure `git mv` once nothing else remains.

### 2. Route module layout

Routes are declared explicitly in `app/routes.ts` (RR7 default; no fs-routes convention — 6 routes don't need one):

```
app/
  root.tsx                 error boundary, theme, <Outlet/>
  routes.ts                explicit route config
  routes/
    login.tsx              GuestRoute equivalent: loader redirects authed users
    logout.tsx             action only
    app-layout.tsx         ProtectedRoute equivalent: requireUser loader, MainLayout
    dashboard.tsx          loader = dashboard summary queries
    data.tsx               loader = table data; actions = CSV import per resource
    health.tsx             GET /health for Railway
  modules/                 ported feature code (dashboard widgets, data tabs)
  server/                  server-only: db.ts, schema.ts, auth.ts, bootstrap.ts, env.ts,
                           imports/ (csv utils + per-resource row schemas/mappers),
                           queries/ (dashboard, revenue, expenses, calls, metrics, profit)
```

Existing `components/ui`, layouts, and page components move under `app/` with import-path fixes only. Redux `appSlice` (modal/UI state) becomes local component state or a small context — it never held server data.

### 3. Auth: signed cookie session, hand-rolled

`createCookieSessionStorage` (react-router built-in) with `secrets: [JWT_SECRET]`, `httpOnly`, `sameSite: 'lax'`, `secure` in production, `maxAge` from `JWT_MAX_AGE`. Session payload: `{ userId }` only — role is read from DB in `requireUser` (cheap, always fresh). Helpers in `server/auth.ts`:

- `login(email, password)`: user lookup + `argon2.verify` (salt embedded in hash; users table unchanged).
- `requireUser(request)`: no session → `redirect('/login')`; returns user.
- `requireAdmin(request)`: `requireUser` + `role === 'ADMIN'` → else 403.

No auth library. Rationale: two fixed roles, no registration, no OAuth — a library adds surface, not safety.

### 4. Drizzle schema mirrors the current Prisma schema 1:1

Same table/column names (`users`, `cities`, `sites`, `site_metrics`, `calls`, `call_imports`, `revenues`, `expenses`, same snake_case mappings), so CSV import mappers and bootstrap logic port without data-shape changes. `drizzle-kit generate` produces a single fresh init migration (dev-time CLI only); in production, migrations are applied programmatically via `migrate()` from `drizzle-orm/node-postgres/migrator` in the server entry before bootstrap — the SQL files ship with the build and `drizzle-kit` stays a devDependency. Old Prisma migrations are deleted with the backend. `drizzle-zod` derives insert schemas where useful; hand-written zod row schemas for CSV parsing stay.

### 5. Queries rewritten resource-by-resource with output parity

Each Nest service's Prisma queries are rewritten in Drizzle inside `server/queries/`. Verification: for each resource, run old endpoint and new loader against the same dev DB and diff the JSON (dashboard summary is the critical one — aggregations across profit/revenue/metrics). The `{ data: T }` / `{ error }` envelope dies; loaders return plain objects and errors go through RR7 error boundaries.

### 6. CSV imports as route actions

`_app.data.tsx` action receives multipart via native `request.formData()` (Node 20+ undici; files are ≤5MB so in-memory is fine, no streaming parser needed), dispatches by `intent` field (resource + upload vs url), and calls the same ported parse/insert pipeline (`assertCsvColumns` allow-extra semantics, skip-rate guard, duplicate-safe inserts via `onConflictDoNothing`). Import responses (`{ created, skipped }`) render via `useActionData`. The old UI metrics-upload bug is retested on this path; expected to disappear with axios/Redux upload plumbing.

### 7. Bootstrap runs in the server entry

Same three steps (users → cities → sites, empty-table guards, env-driven, fault-tolerant, sequence reset) called once at server start before listening. Tests port from the existing 8-case jest suite (runner: vitest, which RR7/Vite templates use natively; jest dies with Nest).

### 8. Env and config

All existing env vars keep their names and meaning; `JWT_EXPIRATION` becomes unused (cookie `maxAge` covers it) and is dropped. Single `.env` (dev) validated by the same zod env schema, ported to `server/env.ts`.

## Risks / Trade-offs

- [Auth rewrite is the sharpest edge] → built and manually verified first (login/logout/guard/admin-403) before any page porting starts.
- [Drizzle aggregation rewrites drift from Prisma results] → per-resource JSON diff against the old endpoints on the same DB before deleting the old code.
- [Multipart handling differs from multer] → calls CSV (4.5MB, Cyrillic headers, BOM) is the canonical test file; verified early.
- [Strangler period has two apps in one repo] → old app stays untouched and runnable; new app changes never edit old workspaces, so rollback = delete `apps/web`.
- [Recharts/react 19 components assume client rendering] → chart modules get `clientLoader`-safe usage or hydrate-only rendering; visual parity checked page-by-page.

## Migration Plan

1. Scaffold `apps/web` (RR7 framework mode + Vite + TS + vitest), health route, env validation.
2. Drizzle schema + init migration; reset dev DB; port bootstrap + tests; verify bootstrap logs.
3. Auth module + login/logout routes + guards; manual verify.
4. Port pages in order: Dashboard (loader + widgets), Data (loader + import actions); JSON-diff queries per resource; retest metrics upload.
5. Cutover: delete `apps/backend`, `apps/frontend`, `contracts/`; flatten to root; update CLAUDE.md/README, lint/knip config; single Railway service — update start command (`drizzle-kit migrate && node ./build/server`), reset prod DB, bootstrap, re-upload CSVs.
6. Archive change; follow-up list for anything deliberately deferred.

Rollback: before cutover — delete `apps/web`; after cutover — git revert (old app fully in history), redeploy previous image, DB re-creatable either way.

## Open Questions

- None blocking. Recharts SSR behavior is the most likely surprise; addressed by hydrate-only rendering if it bites.
