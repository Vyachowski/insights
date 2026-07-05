# Tasks: migrate-to-rr7

## 1. Scaffold

- [ ] 1.1 Scaffold RR7 framework-mode app at `apps/web` (Vite, TS, vitest) as a workspace alongside the existing apps; explicit `routes.ts`; root error boundary with Mantine SSR wiring (`ColorSchemeScript`, style injection, dark default); custom server entry (`server.ts`: Express + `@react-router/express`) since stock `react-router-serve` has no pre-listen hook
- [ ] 1.2 Port zod env validation to `app/server/env.ts` (same vars; drop `JWT_EXPIRATION`); wire `.env` loading for dev
- [ ] 1.3 `GET /health` route with DB connectivity check; `npm run dev -w @insights/web` serves it

## 2. Data layer

- [ ] 2.1 Drizzle schema (`app/server/schema.ts`) mirroring current tables/columns 1:1 (snake_case names, enums, indexes), **including the two partial unique indexes** via `uniqueIndex().where()` (`expenses_date_type_null_site_idx`, `revenue_date_null_site_idx` — Prisma couldn't express them; migration `20260705140000` is the reference SQL)
- [ ] 2.2 `app/server/db.ts` (node-postgres pool + drizzle client); `drizzle-kit generate` init migration (drizzle-kit stays devDependency); programmatic `migrate()` in server entry wrapped in the connect-retry loop (`DATABASE_CONNECT_RETRIES`/`DELAY`)
- [ ] 2.3 Reset dev DB and verify init migration applies cleanly
- [ ] 2.4 Port bootstrap (users/cities/sites, empty-table guards, sequence reset, fault-tolerant) to `app/server/bootstrap.ts`, called from server entry after migrate; port its 8 unit tests to vitest
- [ ] 2.5 Verify bootstrap against fresh dev DB: 2 users / 40 cities / 40 sites from env URLs, skip-on-restart

## 3. Auth (verify before any page work)

- [ ] 3.1 `app/server/auth.ts`: cookie session storage (signed with `JWT_SECRET`, httpOnly, sameSite=lax, secure in prod, maxAge from `JWT_MAX_AGE`); `login`, `requireUser`, `requireAdmin`; unit tests
- [ ] 3.2 `login.tsx` (loader redirects authed users; action verifies argon2 + sets cookie), `logout.tsx` (destroy session), `app-layout.tsx` (requireUser + MainLayout port)
- [ ] 3.3 Manual verify: login with bootstrapped admin, wrong password rejected, protected redirect, logout, USER-role gets 403 on admin action stub

## 4. Dashboard page

- [ ] 4.1 Rewrite dashboard queries (dashboard/profit/revenue/metrics aggregations) in Drizzle under `app/server/queries/`; JSON-diff each against the old Nest endpoints on the same dev DB
- [ ] 4.2 Port `DashboardPage` components/widgets/skeletons; dashboard summary loader (no filter params — parity with today's `GET /dashboard/summary`; the `withSkeleton(lazy(...))` HOC becomes route-level code-splitting + skeleton fallback); delete the useEffect-fetch pattern
- [ ] 4.3 Verify recharts and Mantine under SSR/hydration (no FOUC, no hydration mismatch); apply hydrate-only rendering if needed; visual parity check against old app side-by-side

## 5. Data page + imports

- [ ] 5.1 Port CSV utils + per-resource row schemas/mappers to `app/server/imports/` (allow-extra columns, skip-rate guard, `onConflictDoNothing`); port unit tests
- [ ] 5.2 `data.tsx` loader (table data per resource) + action dispatching by `intent` (upload multipart via `request.formData()` / import-url), guarded by `requireAdmin`
- [ ] 5.3 Port DataPage UI (tabs, import modal) from Redux to `<Form>`/`useFetcher` + action data
- [ ] 5.4 Import all 4 CSVs from `~/Desktop/data/prepared/` through the new UI — including the metrics file that failed in the old UI; verify counts match the old import results (calls, revenue 209, expenses 1120, metrics 22781)
- [ ] 5.5 Full-app JSON/visual parity pass; then stop the old apps

## 6. Cutover + flatten

- [ ] 6.1 Delete `apps/backend`, `apps/frontend`, `contracts/`; flatten `apps/web` to repo root; remove npm workspaces; single root package.json; move `docker-compose.dev.yml` + `dev:up/down/reset/logs` scripts (currently in the backend package) to the root
- [ ] 6.2 Single root ESLint flat config (frontend style: @stylistic, no semicolons, single quotes); update lint-staged pattern; knip config; `npm run lint` + `npm test` + `npm run build` green
- [ ] 6.3 Update CLAUDE.md (commands, remove the DashboardPage known-constraint as resolved) and README
- [ ] 6.4 Full clean-slate rehearsal on dev: drop DB → start → bootstrap → upload CSVs → dashboard numbers spot-checked

## 7. Railway cutover

- [ ] 7.1 Update Railway service: build/start commands for the RR7 app (start = node server only; migrations run in-process); remove `JWT_EXPIRATION` and `ALLOWED_ORIGIN` vars; keep the rest
- [ ] 7.2 Reset prod DB; deploy; verify migrate + bootstrap logs; user uploads CSVs via prod UI; verify dashboard
