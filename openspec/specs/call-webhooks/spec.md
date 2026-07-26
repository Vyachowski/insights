# call-webhooks Specification

## Purpose
TBD - created by archiving change add-gudok-call-webhooks. Update Purpose after archive.
## Requirements
### Requirement: Secret-gated webhook endpoint

The system SHALL expose an HTTP endpoint at `/webhooks/gudok/:secret` that accepts Gudok call-completion webhooks over both `GET` and `POST` (Gudok's configuration lets the operator pick either method). The endpoint SHALL require no cookie session. It SHALL compare `:secret` against the `GUDOK_WEBHOOK_SECRET` env var and reject any request whose secret does not match. Because Gudok's configuration exposes only the destination URL and the HTTP method (no custom headers), the secret MUST travel in the URL path.

#### Scenario: Valid secret over POST accepts the request
- **WHEN** a POST arrives at `/webhooks/gudok/<correct-secret>` with a Gudok payload in the body
- **THEN** the system processes the payload and responds `200`

#### Scenario: Valid secret over GET accepts the request
- **WHEN** a GET arrives at `/webhooks/gudok/<correct-secret>` with the Gudok fields as query parameters
- **THEN** the system processes the payload and responds `200`

#### Scenario: Wrong or missing secret is rejected
- **WHEN** a request arrives with a secret that does not match `GUDOK_WEBHOOK_SECRET` (or the path has no secret segment)
- **THEN** the system responds `404` and does not store anything

#### Scenario: Secret not configured
- **WHEN** `GUDOK_WEBHOOK_SECRET` is unset or empty and any request reaches the endpoint
- **THEN** the system responds `404` and does not store anything

### Requirement: Payload mapping

The system SHALL read the Gudok fields from the JSON/form body for `POST` and from the query string for `GET`, then map the Gudok webhook fields to the `calls` table columns: `id`→`gudokId`, `project_id`→`projectId`, `project_title`→`projectTitle`, `dst`→`dst`, `adv_channel_id`→`advChannelId`, `adv_channel_name`→`advChannelName`, `src`→`src`, `duration`→`duration`, `billsec`→`billsec`, `callstatus`→`callstatus`, `date` (UTC)→`date`, `region`→`region`, `call_number`→`callNumber`, `audio`→`audio`. The row's `source` SHALL be `webhook`.

#### Scenario: Fields are mapped onto the row
- **WHEN** a well-formed payload is received
- **THEN** each Gudok field is written to its corresponding column and `source` is `webhook`

#### Scenario: Malformed payload is rejected
- **WHEN** the request body is missing the required `id` or `date`, or cannot be parsed
- **THEN** the system responds `400` and stores nothing

### Requirement: Collect every call

The system SHALL store every received call regardless of `callstatus` (ANSWERED, BUSY, NO ANSWER) — no status-based filtering. It SHALL persist the complete original payload in a `raw` column on every row so nothing delivered is lost.

#### Scenario: Non-answered calls are stored
- **WHEN** a call with `callstatus` `BUSY` or `NO ANSWER` is received
- **THEN** the call is stored, not discarded

#### Scenario: Raw payload is retained
- **WHEN** any call is stored
- **THEN** the row's `raw` column contains the full original webhook payload

### Requirement: Best-effort site resolution

The system SHALL resolve the owning `siteId` from the call's project title mapped to a city and then to that city's site, reusing the same title→city normalization as the CSV importer. When no site matches, the call SHALL still be stored with a null `siteId` (the `calls.site_id` column is nullable).

#### Scenario: Resolvable project maps to a site
- **WHEN** the payload's project title normalizes to a known city with a site
- **THEN** the row's `siteId` is that site

#### Scenario: Unresolvable project is still stored
- **WHEN** the payload's project title matches no known city/site
- **THEN** the call is stored with `siteId` null and its raw payload retained

### Requirement: Idempotent ingestion

The system SHALL key stored calls on the Gudok call `id` (`gudokId`, unique). A repeated delivery of the same call SHALL NOT create a duplicate row and SHALL still respond `200`.

#### Scenario: Duplicate delivery is a no-op
- **WHEN** a call with a `gudokId` already present is received again
- **THEN** no new row is created and the system responds `200`

