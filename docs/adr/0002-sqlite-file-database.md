# 2. SQLite file as the database

**Status:** accepted

**Decision:** data lives in one SQLite file (better-sqlite3, WAL) on a Railway Volume, with no database service.

**Why:** one writer and a small data set do not justify running and paying for a database server.

**Consequence:** the service runs as a single replica, because a volume attaches to one container. Deploys have brief downtime. Backups are our job, so the server uploads daily snapshots to the bucket (see `docs/operations.md`).
