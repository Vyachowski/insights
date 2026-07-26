# telephony-expense-sync Specification

## Purpose
TBD - created by archiving change sync-gudok-telephony-expenses. Update Purpose after archive.
## Requirements
### Requirement: Gudok operation charges ingest into expenses

The system SHALL accept Gudok `/history` operation rows at a secret-gated endpoint and record the charge rows as expenses. Only rows of type `Списание` SHALL be recorded; `Пополнение`, `Возврат`, and other types SHALL be ignored. Each recorded charge SHALL be stored in `expenses` with `type = 'telephony'`, its `date` from the operation date, its `siteId` resolved from the operation's project (city) via the shared project→site resolver (null when unmatched), and its amount as positive integer kopecks parsed from the Gudok amount string (comma decimal separator, e.g. `-870,000` → 87000 kopecks). The endpoint SHALL enforce the shared secret in the URL path and return `404` on mismatch, mirroring the call webhook.

#### Scenario: Charge rows recorded

- **WHEN** a batch of operation rows including `Списание` and `Пополнение` types is posted with the correct secret
- **THEN** only the `Списание` rows are stored as `telephony` expenses with amounts in kopecks and site resolved from the project, and the response reports created/updated/skipped counts

#### Scenario: Wrong secret

- **WHEN** a batch is posted to the endpoint with a wrong or missing secret
- **THEN** the request is rejected with `404` and nothing is stored

### Requirement: Telephony ingest is idempotent per day and site

Charges SHALL be aggregated by (date, resolved site) into a single `telephony` expense row whose amount is the sum of that day's charges for that site, and the ingest SHALL upsert that row (replacing the stored amount with the freshly computed sum). Re-posting the same days SHALL NOT create duplicate rows and SHALL leave the totals correct, so a run that re-includes already-imported days is safe.

#### Scenario: Same days posted twice

- **WHEN** the same set of operation days is posted a second time
- **THEN** no duplicate expense rows are created and each day/site total equals the sum of that day's charges

#### Scenario: Multiple charges same day and city

- **WHEN** several number-renewal charges occur on one day for one city
- **THEN** they are stored as one `telephony` expense row for that day and site with the summed amount

### Requirement: Incremental sync bounded by last imported day

The system SHALL expose a "since" endpoint returning the latest date for which a `telephony` expense already exists (or null when none). The bookmarklet SHALL use this to expand Gudok's operations date range only back to that day inclusive, so it does not page to the very bottom on every run while still re-collecting the boundary day.

#### Scenario: Since date returned

- **WHEN** the bookmarklet requests the "since" date and telephony expenses already exist
- **THEN** the endpoint returns the most recent telephony expense date, and the bookmarklet collects operations from that date through today

#### Scenario: No prior telephony data

- **WHEN** the "since" endpoint is requested and no telephony expenses exist yet
- **THEN** it returns null and the bookmarklet falls back to a sensible default range

### Requirement: Bookmarklet collects charges from the live Gudok page

A bookmarklet, run on the authenticated Gudok `/history` page, SHALL set the operations date range from the "since" date through today, ensure all in-range rows are loaded, read each row's date, operation text, project, type, and amount from the table, and post the collected rows to the ingest endpoint. It SHALL run in the user's existing Gudok session and SHALL NOT require storing Gudok credentials in the app.

#### Scenario: One-click collection

- **WHEN** the user opens the Gudok operations page and activates the bookmarklet
- **THEN** it loads the operations from the since-date onward, posts them to the ingest endpoint, and reports how many charges were recorded

