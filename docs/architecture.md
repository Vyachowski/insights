# Architecture

Key decisions in one place. Product rules live in `docs/product-rules.md`.

## Decisions

- **One app.** Insights is one React Router 7 framework-mode app on one Node server. Loaders are the only read path, actions the only write path. There is no separate backend, REST layer or client store for server data. The app started as a NestJS + Prisma + Postgres monorepo, which was too heavy for a solo project. Webhook routes are the only endpoints meant for outside callers.
- **SQLite file.** Data lives in one SQLite file (better-sqlite3, WAL) on a Railway Volume, because one writer and a small data set do not justify a database server. The service runs as a single replica, deploys have brief downtime, and the server uploads daily snapshots to the bucket (see `docs/operations.md`).
- **Money as integer kopecks.** `db` stores and returns integer kopecks, so sums stay exact. Services convert with `toKopecks` and `toRubles` from `core`. Screens only see rubles, so every read of money goes through a service.

## Layers

```text
Request
   │
   ▼
┌─ Route module ───────────────────────────────────┐
│ HTTP, access check, renders one screen           │
└──────────────────────────────────────────────────┘
   │ calls
   ▼
┌─ Service ────────────────────────────────────────┐
│ runs one operation step by step                  │
│                                                  │
│ ┌─ core ─────────────┐   ┌─ db ────────────────┐ │
│ │ pure logic         │   │ reads and writes    │ │
│ │ data in, data out  │   │ SQL only            │ │
│ └────────────────────┘   └─────────────────────┘ │
│                                                  │
│ core and db never call each other                │
└──────────────────────────────────────────────────┘
```

A service holds the steps of an operation and uses `core` and `db` inside them. A plain read with no logic and no money skips the service: loader → `db`.

| Layer | Folder | Does | Never does |
|---|---|---|---|
| Route module | `app/routes/` | HTTP, access check, renders one screen | business rules, queries beyond a plain `db` read |
| Service | `app/server/services/` | runs one operation step by step, owns transactions | SQL, HTTP |
| Core | `app/server/core/` | pure functions: parsing, checks, calculations | database, network, files, the current time |
| Db | `app/server/db/` (queries in `queries/`) | schema, connection, reads and writes | business decisions, rubles, CSV, Gudok, HTTP |
| Screen | `app/screens/` | layout and screen state | calculations, server calls beyond route data |

Functional core, imperative shell: `core` is the pure centre, everything else is the shell.

## Rules

- `core` and `db` do not know each other. Only a service joins them.
- `db` holds no business decisions, but it does what SQL does itself: aggregates and atomic writes. An upsert or a call count stays in `db` as one named function.
- A loader may read `db` directly when there is no logic and no money. Every write goes through a service.
- A service reads the current time and passes it to `core`, so `core` stays pure.
- A service opens a transaction with `transaction(fn)` from `db`. better-sqlite3 runs it synchronously, so nothing inside may be async.
- `backup`, `health` and `server.ts` use the connection in `db/client.ts` directly. Everything else uses `db` functions.
- Screens format values with `app/lib/`. Filtering, sorting and paging of loaded rows stay in the browser, in hooks.

`eslint.config.js` enforces these imports.

## Tests

- Tests sit beside the source as `*.test.ts`.
- Every test runs on a real in-memory SQLite built from the committed migrations. The Vitest setup swaps `db/client.ts`, so a test needs no setup of its own.
- To force a rare case, replace one `db` function with `vi.spyOn`.
