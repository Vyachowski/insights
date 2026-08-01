# data-backup Specification

## Purpose
Scheduled SQLite backups to the project's S3-compatible bucket: daily consistent snapshots, restart-surviving scheduling with the bucket as the state store, deterministic retention pruning, and strict isolation from application health.

## Requirements
### Requirement: Daily database backup to the project bucket

When bucket storage is configured, the system SHALL upload one consistent snapshot of the SQLite database per UTC day to the bucket under `backups/insights-YYYY-MM-DD.db`. The snapshot SHALL be taken with the online backup API (safe under WAL, non-blocking for concurrent reads/writes). At most one backup runs at a time — a tick arriving while a backup is in flight is skipped silently; temp snapshot files are removed after upload and stale ones cleaned before the next attempt.

#### Scenario: First cycle of the day

- **WHEN** the scheduler ticks and no object exists for today's key
- **THEN** a snapshot is taken, uploaded as `backups/insights-<today>.db`, and the temp file is removed

#### Scenario: Backup already exists

- **WHEN** the scheduler ticks and today's object already exists
- **THEN** no snapshot or upload happens

### Requirement: Backup schedule survives restarts and downtime

The scheduler SHALL check hourly and once at startup whether today's backup exists, using the bucket itself as the state store. A restart or downtime spanning the nominal backup moment SHALL self-heal within one tick. The scheduler SHALL be stoppable: it exposes a stop function that clears its interval timer, and the server SHALL call it during graceful shutdown so no new backup cycle starts while the process is exiting. Closing the SQLite connection on shutdown SHALL be guarded so it does not error against an in-flight snapshot; if a snapshot is still running, the existing safety-net exit bounds the wait.

#### Scenario: Deploy at the scheduled moment

- **WHEN** the app was restarting while a day's first tick would have run
- **THEN** the startup check finds no object for today and the backup runs immediately

#### Scenario: Scheduler stops on shutdown

- **WHEN** the server receives `SIGTERM`/`SIGINT` and begins graceful shutdown
- **THEN** the backup interval timer is cleared and no further backup cycle starts

### Requirement: Retention by deterministic pruning

After a successful upload, the system SHALL delete backup objects dated inside a small sliding window beyond the retention period (default 14 days). Deleting missing objects is a no-op; no bucket listing is required.

#### Scenario: Old backup pruned

- **WHEN** a backup succeeds on day D
- **THEN** objects dated D−14 through D−16 are deleted if present, leaving at most 14 daily backups under normal operation

### Requirement: Backups never harm the application

Backup and pruning failures SHALL be caught, logged, and retried on the next tick. The scheduler SHALL NOT crash the server, block request handling, or run when bucket storage is not configured (a single "backups disabled" log line instead).

#### Scenario: Bucket unreachable

- **WHEN** an upload fails (network, credentials, outage)
- **THEN** the error is logged, the app keeps serving requests, and the next hourly tick retries

#### Scenario: No bucket configured

- **WHEN** the app starts without bucket credentials (e.g. local dev)
- **THEN** the scheduler logs once that backups are disabled and never ticks
