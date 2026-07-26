## Context

Gudok's `/history` page renders an operations table `#account-operations-<userId>` with columns `created_at`, `text`, `project`, `kind_texted`, `amount`, `current_balance`. Each `<tr>` carries the Gudok operation id as its DOM `id`. Charges look like:

```
26.07.2026 | Продление: Гудок-номер +7 844 260 69 54 | Волгоград.. | Списание | -870,000 i | 0,000 i
```

- `amount` uses a comma decimal separator with 3 fraction digits and a trailing ruble-icon span: `-870,000` = 870.0 ₽.
- `project` shows the city name, sometimes with a trailing `..` decoration/truncation.
- The table is DataTables server-side (`data-source="/history.json"`), default range last 2 weeks, with a "Показать ещё" (`.load-more-btn`) pager and a date-range picker (`window.goodok_daterangepicker`).

We already have `expenses (date, siteId, amount, type, comment)` with unique keys `(date, siteId, type)` and `(date, type) where site IS NULL`, and `resolveSiteIdByProjectTitle` mapping a project title → canonical city → siteId. Money is integer kopecks, rubles at the query boundary.

## Goals / Non-Goals

**Goals:**
- Get real telephony charges into `expenses` as `type='telephony'` with minimal moving parts and no stored Gudok credentials.
- Idempotent, re-runnable ingest that never duplicates and safely re-collects the last day.
- Bound the browser-side work so it doesn't page to the bottom each time.

**Non-Goals:**
- No server-side headless browser, no Gudok login automation.
- No schema change; no new expense category UI.
- `Возврат` (refunds) not netted out in v1 (charges only).

## Decisions

- **Aggregate per (date, site), upsert by the existing unique key.** For each posted `Списание` row: parse date, amount (kopecks), resolve site. Group by (date, siteId), sum amounts, and upsert one `telephony` row per group with `SET amount = <full recomputed sum>`.
  - Rationale: fits `expenses (date, siteId, type)` uniqueness exactly, so no schema change and natural dedup. Because every run re-collects a day in full (see incremental crawl), replacing the amount with the recomputed sum is always correct — this is what makes "re-collect the boundary day" safe.
  - Alternative considered: store one expense per operation with a unique `gudokOperationId` column — rejected, needs a schema/migration and relaxing the `(date, site, type)` unique key.
- **Amount parse.** Strip everything but digits, sign, comma/dot; treat comma as decimal: `-870,000` → `-870.000` → `Math.round(870.0 * 100)` = `87000` kopecks; store the absolute value (expenses are positive costs).
- **Project → site.** Strip a trailing `.`/whitespace run, then reuse `resolveProjectTitle`/`loadCityToSiteId`. Match by exact canonical city name; if the visible name is truncated (long cities like `Ростов-На-Дону`), fall back to a prefix match against known city names, and resolve to null when still ambiguous. Null-site charges aggregate under the `(date, type) where site IS NULL` key. Keep the operation text (e.g. the phone number) in `comment` for traceability.
- **Two endpoints, mirroring the call webhook.** `GET  /webhooks/gudok/expenses/:secret/since` → `{ since: 'YYYY-MM-DD' | null }` (max `date` where `type='telephony'`). `POST /webhooks/gudok/expenses/:secret` with `{ operations: [{ id, date, text, project, kind, amount }] }` → parse/aggregate/upsert, returns `{ created, updated, skipped }`. Reuse `GUDOK_WEBHOOK_SECRET`; 404 on mismatch.
- **CORS.** The bookmarklet posts from `https://in.gudok.tel`, a different origin, so both endpoints send `Access-Control-Allow-Origin: https://in.gudok.tel` and handle the `OPTIONS` preflight (JSON content-type triggers it). Secret still gates the actual work.
- **Bookmarklet crawl strategy.** (1) `GET .../since`. (2) Set Gudok's date range to `[since .. today]` via `window.goodok_daterangepicker` + trigger reload; if driving the picker proves brittle, fall back to fetching `/history.json` for the range. (3) Click `.load-more-btn` until the oldest loaded row's date `< since` or the button is gone — rows are date-desc, so this stops early and stays bounded. (4) Scrape rows where `kind_texted === 'Списание'` and `date >= since`; collect `{ id, date, text, project, amount }`. (5) POST them; alert the returned counts.
  - Rationale: no credentials, uses the live session, and the since-bound keeps clicks minimal per the user's requirement.

## Risks / Trade-offs

- [Gudok markup/JS changes break scraping] → the bookmarklet is a single small checked-in file the user can re-paste; selectors are documented. Accepted per the user ("поправим если поменяют").
- [Long city names truncated in the project cell] → prefix-match fallback + null-on-ambiguous; unmatched charges still land as company-level (null site) telephony so totals aren't lost.
- [A manual `telephony` expense on the same (date, site) would be overwritten by a sync] → telephony is meant to come only from this sync; documented, not guarded in v1.
- [Refunds/adjustments ignored] → v1 counts charges only; can net `Возврат` later if it matters.
- [Verification needs the live authenticated page] → the bookmarklet can only be end-to-end tested by the user on Gudok; server parsing/aggregation is unit-testable with the sample HTML/rows.
