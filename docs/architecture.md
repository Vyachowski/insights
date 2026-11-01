# Architecture

Key decisions in one place. Product rules live in `docs/product-rules.md`.

## Decisions

- **One app.** Insights is one React Router 7 framework-mode app on one Node server. Loaders are the only read path, actions the only write path. There is no separate backend, REST layer or client store for server data. The app started as a NestJS + Prisma + Postgres monorepo, which was too heavy for a solo project. Webhook routes are the only endpoints meant for outside callers.
- **SQLite file.** Data lives in one SQLite file (better-sqlite3, WAL) on a Railway Volume, because one writer and a small data set do not justify a database server. The service runs as a single replica, deploys have brief downtime, and the server uploads daily snapshots to the bucket (see `docs/operations.md`).
- **Money as integer kopecks.** `db` stores and returns integer kopecks, so sums stay exact. `core` converts with `toKopecks` and `toRubles` when a service passes it the rows. Screens only see rubles, so every read of money goes through a service.

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
| Route module | `app/routes/`, shared code in `app/routes/helpers/` | HTTP, access check, renders one screen. One route file is one address; a helper is what routes share | business rules, queries beyond a plain `db` read |
| Service | `app/server/services/`, shared code in `app/server/services/helpers/` | runs one operation step by step, owns transactions | SQL, HTTP requests and responses |
| Core | `app/server/core/` | pure functions: parsing, checks, calculations | database, network, files, the current time |
| Db | `app/server/db/` (queries in `queries/`) | schema, connection, reads and writes | business decisions, rubles, parsing of CSV or webhooks, HTTP |
| Job | `app/server/jobs/` | runs on a timer, logs its failures | logic of its own: that stays in a service |
| Screen | `app/screens/` | layout and screen state | calculations, server calls beyond route data, values formatted by hand |

Functional core, imperative shell: `core` is the pure centre, everything else is the shell.

## Rules

- `core` and `db` do not know each other. Only a service joins them.
- `db` holds no business decisions, but it does what SQL does itself: aggregates and atomic writes. An upsert or a call count stays in `db` as one named function.
- A loader may read `db` directly when there is no logic and no money. Every write goes through a service.
- A service reads the current time and passes it to `core`, so `core` stays pure.
- A service opens a transaction with `transaction(fn)` from `db`. better-sqlite3 runs it synchronously, so nothing inside may be async.
- `jobs/backup`, `health` and `server.ts` use the connection in `db/client.ts` directly. Everything else uses `db` functions.
- `jobs/backup` is the one job that still holds its own logic, until it moves to a service.
- Screens format values and total rows with `app/lib/`. Filtering, sorting and paging of loaded rows stay in the browser, in `app/hooks/`.
- Small app: choose plain functions; add a seam only when a second implementation exists.

`eslint.config.js` enforces these imports. It also refuses hand totals and formatting in screens, and the clock, network, console and process in `core`.

## Names

Files:

- A file name says what all the code inside is about: `startup.ts`, `money.ts`, `storage.ts`. It need not match a function in it.
- A component or a hook gives the file its name: `Button.tsx`, `useTable.ts`.
- Every other file is kebab-case: `auto-charges.ts`.
- Check a name: from the name alone you can tell what is inside and what does not belong there.
- No file names without a topic: `utils`, `helpers`, `common`, `misc`, `shared`.
- Route files follow their address: `webhooks.gudok.$secret.ts`.

Folders:

- Folders are kebab-case and name a type of thing, not a purpose: `services/`, `hooks/`, `components/`. Inside `app/screens/`, each folder is one screen.
- A folder needs two files or more. A single file sits in its parent: `app/theme.ts`, `app/menu-items.ts`.
- `helpers/` is the shared code of one layer, and one file is enough: `app/routes/helpers/`, `app/server/services/helpers/`.
- A helper does one step. A service runs a whole operation.
- `app/lib/` holds plain browser functions, with no React.
- `app/server/db/` holds what is about the database but is not a query. `queries/` holds queries and pieces of SQL.

## Tests

- Tests sit beside the source as `*.test.ts`.
- Every test that reads or writes data runs on a real in-memory SQLite built from the committed migrations. The Vitest setup swaps `db/client.ts`, so a test needs no setup of its own.
- Backup tests fake the connection, because a snapshot needs a file. Route tests may fake their service, because they check HTTP only.
- To force a rare case, replace one `db` function with `vi.spyOn`.
