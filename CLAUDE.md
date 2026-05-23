# Insights — developer reference

Business analytics dashboard for site owners and analysts. Tracks revenue, expenses, SEO metrics, and call data across a portfolio of sites grouped by city.

## Repository layout

```
insights/
├── apps/backend/       # NestJS REST API
├── apps/frontend/      # React SPA (Vite)
└── packages/contracts/ # Shared TypeScript types (no runtime code)
```

npm workspaces monorepo. Both apps import from `@insights/contracts`.

## Data model

```
User
City → Site → SiteMetric   (SEO metrics per day per site)
             → Call         (individual call from Gudok webhook)
             → CallImport   (raw CSV row before deduplication)
             → Revenue      (monthly revenue per site)
             → Expense      (cost entry with type, per site)
```

`Site` is the central entity. Everything aggregatable rolls up to `City`. Revenue and Expense have nullable `siteId` — null means company-level entry, not site-specific.

## API conventions

- Base path: `/api/v1/`
- Auth: JWT stored in httpOnly cookie `access_token`; set on `POST /auth/login`, cleared on `POST /auth/logout`
- Every successful response is wrapped: `{ data: T }` — via `ResponseInterceptor`
- Every error response is wrapped: `{ error: { code, message, details? } }` — via `AllExceptionsFilter`
- `code` is a string constant mapped from HTTP status (e.g. `UNAUTHORIZED`, `NOT_FOUND`)

Both shapes are typed in `packages/contracts/api.types.ts` as `ApiSuccess<T>` and `ApiFailure`.

## packages/contracts

Single source of truth for types shared between backend and frontend. Contains:

- `api.types.ts` — `ApiResponse<T>`, `ApiSuccess<T>`, `ApiFailure`, `ApiError`
- `auth.types.ts` — `LoginRequest`, `User`
- `dashboard.contract.ts` — all dashboard widget response shapes
- `analytics.types.ts` — analytics query/response types

Add types here when a new endpoint's payload needs to be consumed by the frontend.

## Backend patterns

- All modules follow NestJS standard: `module / controller / service`
- Guards: `JwtAuthGuard` (protected routes), `LocalAuthGuard` (login only)
- `@CurrentUser()` decorator extracts the user from JWT payload
- Zod schemas auto-generated from Prisma schema via `prisma-zod-generator`; used for DTO validation
- Swagger: every controller has `@ApiTags`, every endpoint has `@ApiOperation` + `@ApiWrappedResponse`
- `@ApiWrappedResponse(Dto)` is a custom decorator that wraps the Swagger schema in `{ data: T }`

Adding a new module: NestJS CLI → register in `AppModule` → add contracts types if frontend needs them.

## Frontend patterns

- Redux Toolkit slices: `authSlice` (user session), `appSlice` (global UI state), `dashboardSlice` (dashboard data)
- Axios instance in `src/lib/axios.ts` — `withCredentials: true` (sends cookies), base URL from `VITE_API_BASE_URL`
- API errors are parsed in the Axios layer and thrown as typed errors before reaching Redux
- Route guards: `<ProtectedRoute>` redirects to login if unauthenticated, `<GuestRoute>` redirects to dashboard if already logged in

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

## Deployment

Target: Railway (Postgres + Node service). On deploy: `prisma migrate deploy` runs before the server starts. Frontend is a static build, hosted separately.
