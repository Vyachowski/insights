# api-conventions Specification (delta)

## REMOVED Requirements

### Requirement: Versioned base route

**Reason**: There is no external REST API; loaders/actions are internal to the app.
**Migration**: None needed — no external consumers existed.

### Requirement: JWT authentication via httpOnly cookie

**Reason**: Passport JWT flow is replaced by hand-rolled cookie sessions.
**Migration**: Signed httpOnly session cookie via `createCookieSessionStorage`; argon2 hashes unchanged. See `fullstack-architecture`.

### Requirement: Uniform response and error envelopes

**Reason**: The `{ data: T }` / `{ error: { code, message, details? } }` envelope typed the REST seam; loaders return plain values and errors use route error boundaries.
**Migration**: Delete envelope handling (`ResponseInterceptor`, `AllExceptionsFilter`, `parseApiError`); import actions return `{ created, skipped }` or readable validation errors as action data.

### Requirement: Health check endpoint

**Reason**: Moved, not conceptually removed — re-specified in `fullstack-architecture` as a route.
**Migration**: `GET /health` route in the RR7 server returning 200 with a DB connectivity check.
