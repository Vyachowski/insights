## MODIFIED Requirements

### Requirement: Backup schedule survives restarts and downtime

The scheduler SHALL check hourly and once at startup whether today's backup exists, using the bucket itself as the state store. A restart or downtime spanning the nominal backup moment SHALL self-heal within one tick. The scheduler SHALL be stoppable: it exposes a stop function that clears its interval timer, and the server SHALL call it during graceful shutdown so no new backup cycle starts while the process is exiting. Closing the SQLite connection on shutdown SHALL be guarded so it does not error against an in-flight snapshot; if a snapshot is still running, the existing safety-net exit bounds the wait.

#### Scenario: Deploy at the scheduled moment

- **WHEN** the app was restarting while a day's first tick would have run
- **THEN** the startup check finds no object for today and the backup runs immediately

#### Scenario: Scheduler stops on shutdown

- **WHEN** the server receives `SIGTERM`/`SIGINT` and begins graceful shutdown
- **THEN** the backup interval timer is cleared and no further backup cycle starts
