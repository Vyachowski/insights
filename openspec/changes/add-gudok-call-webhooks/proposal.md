## Why

Call data currently enters only through manual, admin-only CSV uploads of an aggregated Gudok export — delayed, filtered, and lossy. Gudok can push a webhook after every call ends; capturing those events gives us a complete, near-real-time record of **every** call (answered, busy, no-answer) in its own table, independent of the CSV workflow.

## What Changes

- Add a public webhook endpoint that receives Gudok call-completion events (POST) and stores each one in the existing `calls` table.
- Protect the endpoint with a secret token embedded in the URL path (Gudok sends no signature/auth), validated against an env var; unknown/missing secret → 404.
- Persist **all** calls: keep the full raw payload on every row, and resolve `siteId` best-effort from the project title → city → site. Calls that can't be matched to a site are still stored (`siteId` becomes nullable).
- Idempotent ingestion keyed on Gudok's call `id` (`gudokId`), so retried/duplicate deliveries don't create duplicates.
- **BREAKING (schema)**: `calls.site_id` becomes nullable and a new `raw` (JSON text) column is added. New migration generated from `schema.ts`. The `calls` table is currently unused (no reads), so no query or UI is affected.
- Add `GUDOK_WEBHOOK_SECRET` to env validation and `.env.example`.

## Capabilities

### New Capabilities
- `call-webhooks`: Receiving Gudok call-completion webhooks and collecting every call into the `calls` table — endpoint routing, secret-token authentication, payload mapping, best-effort site resolution, raw-payload retention, and idempotent upsert.

### Modified Capabilities
<!-- None. data-import stays scoped to admin CSV uploads + bootstrap; webhook ingestion is a distinct, non-admin, real-time entry path owned by call-webhooks. -->

## Impact

- **Routes**: new resource route `routes/webhooks.gudok.$secret.ts` (POST action), registered in `app/routes.ts`; unauthenticated (no cookie session) but secret-gated.
- **Schema/DB**: `app/server/schema.ts` `calls` table — `siteId` nullable, new `raw` column; one generated migration in `drizzle/`.
- **Server**: new ingestion module under `app/server/` (payload validation + site resolution reusing the CSV importer's project-title→city mapping) with colocated vitest tests.
- **Config**: `GUDOK_WEBHOOK_SECRET` env var (validation + `.env.example`); the webhook URL to configure in Gudok is `<APP_URL>/webhooks/gudok/<secret>`.
- **No impact** on the dashboard (reads `callImports`, not `calls`) or existing CSV import flow.
