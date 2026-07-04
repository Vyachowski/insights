## ADDED Requirements

### Requirement: Versioned base route

All backend HTTP routes SHALL be served under the `/api/v1/` base path.

#### Scenario: Auth route is versioned

- **WHEN** a client calls the login endpoint
- **THEN** it is reachable at `POST /api/v1/auth/login`

### Requirement: JWT authentication via httpOnly cookie

Authentication SHALL use a JWT stored in an `httpOnly` cookie named `access_token`, issued on `POST /auth/login` and cleared on `POST /auth/logout`.

#### Scenario: Login sets the auth cookie

- **WHEN** a user logs in with valid credentials
- **THEN** the response sets an `httpOnly` cookie named `access_token`

#### Scenario: Logout clears the auth cookie

- **WHEN** a user calls `POST /auth/logout`
- **THEN** the `access_token` cookie is cleared

### Requirement: Uniform response and error envelopes

Every successful response SHALL be wrapped as `{ data: T }`; every error SHALL be `{ error: { code, message, details? } }`. Both shapes MUST be typed in `contracts/api.types.ts`.

#### Scenario: Success is wrapped in a data envelope

- **WHEN** a request succeeds
- **THEN** the response body is `{ data: <payload> }`

#### Scenario: Error is wrapped in an error envelope

- **WHEN** a request fails
- **THEN** the response body is `{ error: { code, message } }`, optionally including `details`

### Requirement: Health check endpoint

The backend SHALL expose `GET /health` (via `@nestjs/terminus`) that checks heap memory and a `SELECT 1` database round-trip, for use by platform health checks.

#### Scenario: Health check reports healthy when DB is reachable

- **WHEN** `GET /health` is called and the database responds to `SELECT 1`
- **THEN** it returns a healthy status
