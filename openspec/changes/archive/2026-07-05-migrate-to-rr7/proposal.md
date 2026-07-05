# Proposal: migrate-to-rr7

## Why

Insights is a single-consumer authenticated dashboard maintained by one developer, yet it is built as two applications joined by a REST seam: NestJS API + React SPA + shared contracts + axios layer + Redux mirroring server state. None of the forcing conditions for a separate backend apply (no second client, no public API, no separate teams/runtimes, no scaling asymmetry). The seam is pure overhead — every feature costs a DTO, a controller, a service, an axios call, a thunk, a slice, and a selector. Migrating to React Router 7 framework mode collapses the two apps into one: pages load data in `loader`s, mutate in `action`s, and the whole system deploys as a single Railway service. This is an *evolution* of the existing code — the router is already react-router and the React components port as-is. The data layer moves to Drizzle: its SQL-shaped query builder fits the dashboard's aggregation queries better than Prisma, drops all codegen, and (deliberate side benefit for a solo maintainer) keeps working SQL knowledge fresh.

## What Changes

- **New single app** on React Router 7 framework mode (Vite, SSR server on Node), replacing both `apps/backend` and `apps/frontend`. The monorepo dies with the seam: at cutover the repo is flattened to a single root `package.json` (no npm workspaces, no `-w` flags, no `concurrently`); during migration the new app is built alongside the old workspaces and the flatten is the final step.
- **Data loading**: Redux dashboard/auth thunks + axios layer + `contracts/` are replaced by typed `loader`/`action` functions querying the DB directly. This also resolves the long-standing `DashboardPage` useEffect-fetch constraint documented in CLAUDE.md.
- **Prisma → Drizzle**: schema becomes a single TS file (`drizzle-kit` migrations, fresh `init`), queries are rewritten in Drizzle's SQL-like builder — a better fit for the dashboard's aggregation queries than Prisma's `groupBy`. Kills codegen entirely (`prisma generate` pre-dev step, ~730 generated files, `prisma-zod-generator`); `drizzle-zod` derives zod schemas from tables. Data is disposable pre-prod: drop DB → migrate → bootstrap → re-upload CSVs (the flow built by `remove-seed`).
- **Auth**: hand-rolled, no auth library. RR7's built-in `createCookieSessionStorage` (signed httpOnly cookie) + `argon2.verify` — argon2 hashes embed their own salt, so the `users` table and existing hashes are unchanged. `requireUser`/`requireAdmin` helpers guard loaders/actions (two fixed roles, no extensibility planned). Deliberately self-made: the auth surface is small enough that a library adds more attack/maintenance surface than it removes.
- **CSV imports**: `POST <resource>/import(-url)` controllers become route actions with multipart handling; the parse/validate logic (`csv.utils`, zod row schemas, skip-rate guard) moves as-is. The known frontend metrics-upload bug is expected to die with the old upload path (verified during migration).
- **Startup bootstrap** (users/cities/sites from env) moves into the RR7 server entry, logic unchanged.
- **BREAKING removals**: NestJS (all `@nestjs/*` deps), Prisma (client, CLI, zod generator), passport, class-validator/class-transformer, Swagger/OpenAPI docs (no external API consumers), axios, Redux Toolkit, `contracts/` workspace. A minimal `/health` route is kept for Railway.
- **Deploy**: one Railway service serving both pages and data; env vars unchanged (`DATABASE_URL`, `JWT_SECRET`, bootstrap vars, CSV URLs).

## Capabilities

### New Capabilities

- `fullstack-architecture`: how the RR7 app is organized — routes, loaders/actions, server-only modules (db, auth, imports, bootstrap), session handling, error boundaries.

### Modified Capabilities

- `app`: app layout / structure description changes from a two-workspace monorepo to a flat single-package repo.
- `data-import`: import endpoints become route actions; bootstrap host moves from Nest lifecycle hook to server entry (behavioral requirements otherwise unchanged).
- `development-workflow`: dev/build/test commands collapse to one app; contract-first flow replaced by loader-first flow.

### Removed Capabilities

- `backend-architecture`: NestJS module organization no longer exists.
- `frontend-architecture`: SPA/Redux/axios organization no longer exists.
- `api-conventions`: REST envelope/DTO conventions no longer exist (no external API surface).

## Impact

- Code: `apps/backend` (~2.7k lines + prisma) and `apps/frontend` (~3.5k lines) replaced by one flat app (~estimate 3–3.5k lines); `contracts/` deleted; npm workspaces removed; React components/charts/layouts ported with minimal edits.
- Deps: −~28 packages (Nest/Prisma/passport/class-validator/Swagger/axios/Redux), +react-router, @react-router/dev, @react-router/express + express (custom server entry), drizzle-orm/drizzle-kit/drizzle-zod, pg (argon2 and zod stay; no auth library).
- Tests: bootstrap + CSV utils tests port; Nest controller/service scaffold specs die with Nest (including the 19 known-broken ones).
- Deploy: Railway start command changes; single service; DB recreated from scratch (drizzle-kit init migration → bootstrap → CSV re-upload; data is disposable pre-prod).
- Risk: two subsystems are rewritten rather than ported — auth (passport → cookie sessions) and the query layer (Prisma → Drizzle, ~10 files); both verified early during implementation.
- Docs: CLAUDE.md dev commands and known-constraints section updated; the DashboardPage loader constraint is removed as resolved.
