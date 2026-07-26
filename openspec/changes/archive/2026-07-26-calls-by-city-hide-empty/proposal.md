## Why

The Calls-by-City widget («Звонки по городам») lists every city in the portfolio, including cities with zero calls in both the current and previous year. These empty rows add noise and push cities that actually have data further down the scrollable list.

## What Changes

- The Calls-by-City widget SHALL show only cities that have at least one call in the current year or the previous year. Cities with zero calls in both years are hidden.
- Filtering happens in the data layer (`mergeCallsByCity`), so the `CityCallsDto[]` the widget receives already excludes empty cities. Ranking and everything else stay the same.
- No DTO shape change, no query change, no UI-component change.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `dashboard-summary`: the Calls-by-City widget requirement changes from "list every city" to "list only cities with calls in the current or previous year".

## Impact

- `app/server/queries/dashboard.calc.ts` — `mergeCallsByCity` filters out cities with `current === 0 && previous === 0`.
- `openspec/specs/dashboard-summary/spec.md` — Calls-by-City widget requirement and the "All cities listed" scenario.
- No backend schema, migration, or DTO-contract change.
