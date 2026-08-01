# fullstack-architecture Specification

## Purpose
How the single React Router 7 framework-mode application is organized: routes with loaders/actions as the only data paths, server-only modules (Drizzle/SQLite db+schema, cookie-session auth, bootstrap, CSV imports), route error boundaries, and the health endpoint.

## Requirements
### Requirement: Single React Router 7 application

The system SHALL be a single React Router 7 framework-mode application (Vite build, Node SSR server) serving both pages and data. There SHALL be no separate API service, no REST endpoint layer for the app's own UI, and no client-side fetch/store layer for server state.

#### Scenario: One dev command

- **WHEN** a developer runs `npm run dev`
- **THEN** a single Vite dev server serves the whole application (pages, loaders, actions) against the dev database

#### Scenario: One deploy unit

- **WHEN** the app is deployed
- **THEN** a single Railway service runs migrations and starts one Node server that serves everything

### Requirement: Server data flows through loaders and actions only

Route `loader` functions SHALL be the only read path for server data (queries via Drizzle in `server/queries/`), and route `action` functions the only mutation path. Components SHALL consume server data via `useLoaderData`/`useActionData`. Client-side state SHALL be limited to UI concerns (modals, form state, theme) — never a mirror of server data.

#### Scenario: Dashboard data load

- **WHEN** the dashboard route is requested
- **THEN** its loader executes the aggregation queries server-side and the page renders from typed loader data, with no client fetch

#### Scenario: Data revalidates after a mutation

- **WHEN** an action completes (e.g. a CSV import)
- **THEN** the affected loaders revalidate automatically and the page re-renders from fresh loader data, with no manual client-side cache management

### Requirement: Server-only modules are isolated

Database access, auth, bootstrap, env validation, and CSV import logic SHALL live in server-only modules (`app/server/`), never imported into client components. The database SHALL be SQLite (better-sqlite3) opened from `DATABASE_PATH` with WAL journal mode and busy timeout; foreign-key enforcement is enabled after migrations complete. The database schema SHALL be a single Drizzle TS file (sqlite-core) keeping the existing table/column names; money amounts are stored as integer kopecks and converted to rubles at the query boundary; `drizzle-kit` SHALL own migrations.

#### Scenario: Schema change

- **WHEN** a table or column changes in the Drizzle schema
- **THEN** `drizzle-kit generate` produces the SQL migration (dev-time), and the programmatic Drizzle migrator applies pending migrations in the server entry on startup/deploy

#### Scenario: Import runs while the dashboard is read

- **WHEN** an admin runs a large CSV import while another session loads the dashboard
- **THEN** the dashboard request completes successfully (no `SQLITE_BUSY` error surfaces to either session)

### Requirement: Cookie-session authentication with two fixed roles

Authentication SHALL be hand-rolled on React Router's `createCookieSessionStorage`: a signed (`JWT_SECRET`), `httpOnly`, `sameSite=lax` cookie (secure in production) storing only the user id. Passwords SHALL be verified with argon2 against the existing hashes (salt embedded in the hash; users table unchanged). `requireUser` SHALL guard authenticated routes (redirect to `/login` when absent) and `requireAdmin` SHALL additionally enforce `role === 'ADMIN'` (403 otherwise). Roles are fixed: ADMIN and USER.

#### Scenario: Unauthenticated access

- **WHEN** a request without a valid session cookie hits a protected route
- **THEN** the loader redirects to `/login`

#### Scenario: Successful login

- **WHEN** valid credentials are posted to the login action
- **THEN** argon2 verification passes, a signed session cookie is set, and the user is redirected to the dashboard

#### Scenario: Non-admin hits an admin action

- **WHEN** a USER-role session invokes an admin-only action (e.g. CSV import)
- **THEN** the action responds 403 and performs no work

#### Scenario: Logout

- **WHEN** the logout action is invoked
- **THEN** the session is destroyed and the user is redirected to `/login`

### Requirement: Errors surface through route error boundaries

Loader/action failures SHALL propagate to route-level `ErrorBoundary` components (nearest boundary wins; root boundary as fallback). The old `{ data: T }` / `{ error: { code, message } }` envelope SHALL NOT be recreated.

#### Scenario: Query failure

- **WHEN** a loader throws
- **THEN** the nearest route error boundary renders an error state while the rest of the shell stays functional

### Requirement: Health endpoint

The server SHALL expose `GET /health` returning 200 with a minimal body (DB connectivity check) for Railway health checks.

#### Scenario: Railway probe

- **WHEN** Railway probes `/health`
- **THEN** the route returns 200 when the app and DB connection are healthy

### Requirement: Graceful shutdown releases resources in order

On `SIGTERM` or `SIGINT` the server SHALL shut down gracefully: stop accepting new connections (`server.close`), then release stateful resources in a defined order — stop the backup scheduler timer, then close the SQLite connection — and exit with code 0. The handler SHALL be idempotent (a second signal during shutdown is ignored) and bounded by a safety-net timeout (10s) that forces exit 0 if connections or resources do not settle. `server.ts` SHALL be the single owner of shutdown ordering; each stateful module exposes its own stop/close function rather than registering into a shared lifecycle container.

#### Scenario: Normal stop on Railway redeploy

- **WHEN** the platform sends `SIGTERM` during a redeploy
- **THEN** the server stops accepting connections, the backup timer is cleared, the SQLite connection is closed, and the process exits 0 (no "signal SIGTERM" crash in the logs)

#### Scenario: Resources do not settle in time

- **WHEN** in-flight connections or a resource close do not complete within the safety-net window
- **THEN** the safety-net timeout fires and the process still exits 0

#### Scenario: Repeated signal during shutdown

- **WHEN** a second `SIGTERM`/`SIGINT` arrives while shutdown is already in progress
- **THEN** it is ignored and shutdown proceeds once

### Requirement: Lean production runtime image

The deployed runtime image SHALL contain only production `dependencies`; devDependencies SHALL be pruned after the production build completes. The prune step MUST run *after* `react-router build` (the build needs `vite` and `@react-router/dev`, which are devDependencies) and MUST NOT remove any package the production server path imports. Files that are never used at runtime (planning docs under `openspec/`, `.agents/`, `scripts/`, `README.md`, `ROADMAP.md`, test files) SHALL be excluded from the deploy context via `.railwayignore`.

#### Scenario: Runtime image excludes build-only tooling

- **WHEN** the app is built and deployed on Railway
- **THEN** the running image's `node_modules` contains the production `dependencies` only (no `eslint`, `vitest`, `vite`, `drizzle-kit`, or `typescript`), and the server still starts and serves pages

#### Scenario: Prune order preserves the build

- **WHEN** the deploy pipeline runs
- **THEN** `react-router build` runs with all dependencies present, and `npm prune --omit=dev` runs only after the build artifact (`build/`) exists

#### Scenario: Production import paths survive pruning

- **WHEN** devDependencies are pruned and the server starts with `NODE_ENV=production`
- **THEN** every module the production path loads resolves — `server.ts` loads `app/server/*` via `tsx` and `build/server/index.js`, the dev-only `import('vite')` branch is never reached, and migrations apply via the programmatic Drizzle migrator (`drizzle-orm`), not `drizzle-kit`
