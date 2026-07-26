## Why

The dashboard's call metrics (Trends «Звонки» total and Calls-by-City) count only the imported-calls table (`call_imports`) and ignore the webhook-calls table (`calls`) entirely, so every call captured live via the Gudok webhook is invisible in the stats. The counts also need to stay "unique first-time callers" — only the first call from each number — but that uniqueness must now hold across both sources, since the same number can appear in both (overlapping periods).

## What Changes

- Call counts SHALL be drawn from both call tables (`call_imports` and `calls`), not just `call_imports`.
- A call SHALL be counted only if it is a first call from its number (Gudok `callNumber === 1`), and each caller number SHALL be counted at most once across the two tables (deduplicated by `src`).
- Webhook calls not matched to a site (`calls.siteId IS NULL`) SHALL be excluded from the counts.
- Applies to both the total-calls query (Trends) and the per-city query (Calls-by-City); the comparison model, DTOs, and widgets are unchanged.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `dashboard-summary`: adds how summary call counts are defined — unique first-callers deduplicated by phone number across both the imported and webhook call sources, site-matched only.

## Impact

- `app/server/queries/dashboard.ts` — `fetchCallsTotal` and `fetchCallsByCity` union the two tables and count `DISTINCT src` over first-calls; new imports (`calls`, `isNotNull`, union helper).
- `openspec/specs/dashboard-summary/spec.md` — new requirement for cross-source unique call counting.
- No schema, migration, DTO, or widget change.
