# 1. Single React Router app

**Status:** accepted

**Decision:** Insights is one React Router 7 framework-mode app on one Node server. Loaders are the only read path, actions the only write path. There is no separate backend, REST layer or client store for server data.

**Why:** the app started as a NestJS + Prisma + Postgres monorepo, which was too heavy for a solo project. One app means one dev command, one deploy unit, and types that flow from server code by inference.

**Consequence:** webhook routes are the only endpoints meant for outside callers. Client state covers UI concerns only.
