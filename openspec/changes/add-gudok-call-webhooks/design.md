## Context

The `calls` table already exists in `schema.ts` and migration `0000_init.sql` with columns matching the Gudok webhook payload (`gudokId`, `projectId`, `dst`, `advChannelId/Name`, `src`, `duration`, `billsec`, `callstatus`, `date`, `region`, `callNumber`, `audio`, `source` defaulting to `webhook`). Nothing writes to or reads from it today — the dashboard uses the CSV `callImports` table. So this change wires up ingestion into an already-designed-for table, plus two small schema adjustments.

Gudok fires a webhook after each call completes. Its project settings expose **only** a destination URL and a GET/POST method toggle — no headers, no auth, no signature. The app is a single React Router 7 framework-mode server; there is no separate API layer, so the webhook is an ordinary resource route with an `action` (POST) and a `loader` (GET).

## Goals / Non-Goals

**Goals:**
- Receive Gudok call-completion webhooks over GET and POST and store every call in `calls`.
- Never lose a delivered call: keep the raw payload; store even when the site can't be resolved.
- Idempotent on Gudok's call `id` so retries don't duplicate.
- Reasonable protection given Gudok's URL-only config: a secret in the path.

**Non-Goals:**
- Reading/displaying `calls` anywhere (dashboard still uses `callImports`). A later change can migrate reads.
- Backfilling historical calls (webhooks are forward-only; CSV import remains for history).
- Reconciling `calls` with `callImports` or deduping across the two tables.
- Cryptographic verification of Gudok deliveries (not offered by the provider).

## Decisions

**Secret in the URL path** — `/webhooks/gudok/:secret`, matched against `GUDOK_WEBHOOK_SECRET`. Gudok can only be given a URL, so the path is the only place a shared secret can live. On mismatch/absence, return `404` (not `401`) to avoid confirming the endpoint exists. Alternative — query param — rejected: Gudok's UI centers on a single URL field and a path segment is cleaner and less likely to be stripped/logged separately.

**One resource route, both methods** — `routes/webhooks.gudok.$secret.ts` exporting `action` (POST body: JSON or form-encoded) and `loader` (GET query params). Both funnel into one `ingestGudokCall(params)` server function. The operator picks GET or POST in Gudok; supporting both means either choice works with no redeploy. Register in `app/routes.ts` outside the `app-layout` group (no session).

**Schema change: nullable `siteId` + `raw` column** — to honor "collect all", `calls.site_id` becomes nullable and a `raw text` column stores the original payload (JSON string). Generated via `npm run drizzle:generate`. Safe because the table is empty in every environment and has no readers. Existing unique index `calls_site_id_date_src_key` keeps working (SQLite treats NULL site_id rows as distinct); `gudokId` unique is the real idempotency key.

**Idempotency via `onConflictDoNothing` on `gudokId`** — same pattern as the CSV importer. Duplicate deliveries insert nothing and still return `200`, so Gudok won't retry-storm.

**Reuse the importer's title→city mapping** — extract/share the `resolveProjectTitle` + `CITY_ALIASES` logic (currently in `imports/index.ts`) so webhook and CSV resolve sites identically. `project_title` is the field to normalize; fall back to null `siteId` on no match.

**Validation** — a small Zod (or hand-rolled) parser over the merged params; require `id` and `date` (needed for identity and time), coerce numerics, default missing optionals. Malformed → `400`, store nothing.

## Risks / Trade-offs

- **Open endpoint if the secret leaks** → long random secret in the path; `404` on mismatch; secret is env-only, not in logs. Rotating means updating the env var and the Gudok URL.
- **GET payloads in access logs / URL length** → GET carries call fields (incl. `audio` URL) in the query string, which may land in logs. Mitigation: prefer configuring POST in Gudok; GET is a supported fallback only.
- **Gudok field names/shape differ from docs** → keep the full `raw` payload on every row so a mapping fix can re-derive columns later without data loss.
- **`calls` and `callImports` will diverge / double-count** → out of scope here; documented as a follow-up. No dashboard reads `calls`, so no metric is affected yet.
- **`date` timezone** → Gudok sends UTC; store as-is (timestamp_ms), matching the column type.

## Migration Plan

1. Edit `schema.ts` (nullable `siteId`, add `raw`); `npm run drizzle:generate`; commit the SQL. Migration runs automatically at startup.
2. Add `GUDOK_WEBHOOK_SECRET` to env validation and `.env.example`; set it in the deploy environment.
3. Deploy; configure Gudok project webhook URL to `<APP_URL>/webhooks/gudok/<secret>`, method POST; send a test delivery and confirm a row lands in `calls`.
4. **Rollback**: unset the Gudok webhook URL (stops deliveries). The schema change is additive/loosening and harmless to leave in place; the table has no readers.

## Open Questions

- Should GET be disabled once POST is confirmed working in Gudok, to keep call data out of query-string logs? (Default: keep both.)
- Later: migrate dashboard call metrics from `callImports` to the webhook-fed `calls` table, and define the dedup/authority rule between them. (Separate change.)
