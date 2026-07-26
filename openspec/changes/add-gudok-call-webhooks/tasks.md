## 1. Schema & migration

- [x] 1.1 In `app/server/schema.ts`, make `calls.siteId` nullable (drop `.notNull()`, keep the FK + cascade) and add a `raw: text('raw')` column for the full payload
- [x] 1.2 Run `npm run drizzle:generate` and commit the generated SQL in `drizzle/`; confirm `npm run start`/`dev` applies it cleanly to the local DB

## 2. Config

- [x] 2.1 Add `GUDOK_WEBHOOK_SECRET` to the env validation schema (server startup) and to `.env.example`
- [x] 2.2 Set `GUDOK_WEBHOOK_SECRET` in the local `.env` and (later) the deploy environment

## 3. Site resolution reuse

- [x] 3.1 Extract `resolveProjectTitle` + `CITY_ALIASES` and the city→siteId lookup from `app/server/imports/index.ts` into a shared server module so webhook and CSV resolve sites identically
- [x] 3.2 Update the CSV importer to consume the shared helper (no behavior change; verify existing import tests still pass)

## 4. Ingestion module

- [x] 4.1 Add a server module (`app/server/calls/gudok-webhook.ts`) with a payload parser that reads the 14 Gudok fields, requires `id` and `date`, coerces numerics, and returns a typed result or a validation error
- [x] 4.2 Implement `ingestGudokCall(payload)`: map fields to `calls` columns, best-effort `siteId` via the shared resolver (null on no match), store the original payload in `raw`, `source: 'webhook'`, insert with `onConflictDoNothing` on `gudokId`
- [x] 4.3 Colocate vitest tests: field mapping, non-answered call stored, unresolved project → null `siteId`, duplicate `gudokId` is a no-op, malformed payload rejected

## 5. Route

- [x] 5.1 Add `app/routes/webhooks.gudok.$secret.ts` with an `action` (POST: parse JSON or form body) and a `loader` (GET: read query params), both validating `:secret` against `GUDOK_WEBHOOK_SECRET` and returning `404` on mismatch/unset
- [x] 5.2 On valid secret, merge params → `ingestGudokCall`; return `200` on success (incl. idempotent no-op), `400` on malformed payload
- [x] 5.3 Register the route in `app/routes.ts` outside the `app-layout` group (no cookie session)

## 6. Verify

- [x] 6.1 `npm run lint`, `npm run typecheck`, `npm test` all green
- [x] 6.2 Manually POST and GET a sample Gudok payload to `/webhooks/gudok/<secret>` locally; confirm a row lands in `calls` with correct mapping and `raw`, wrong secret returns `404`, duplicate `id` doesn't duplicate
- [x] 6.3 Document how to run Gudok's built-in test delivery against the endpoint and how to identify + delete the resulting test row(s) afterward (find newest `calls` rows / inspect `raw`, delete by `gudokId`); provide a ready SQL snippet
- [x] 6.4 Update `CLAUDE.md`/relevant spec notes with the webhook URL shape (`<APP_URL>/webhooks/gudok/<secret>`) and the new env var
