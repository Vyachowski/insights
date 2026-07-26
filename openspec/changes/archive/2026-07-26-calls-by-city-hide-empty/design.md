## Context

`mergeCallsByCity` in `app/server/queries/dashboard.calc.ts` maps every city to a `CityCallsDto` (`{ city, current, previous }`) using `?? 0` for missing counts, then sorts by `current` descending. Cities with no calls in either year come through as `{ current: 0, previous: 0 }` and render as empty rows in the widget. `fetchCallsByCity` already passes the full city list plus per-period counts.

## Goals / Non-Goals

**Goals**
- Exclude cities with `current === 0 && previous === 0` from the returned `CityCallsDto[]`.

**Non-Goals**
- No change to ranking, DTO shape, query SQL, or the widget component.
- No change to how a city with calls in only one of the two years is shown (it stays).

## Decisions

**Where to filter.** Add a `.filter(c => c.current !== 0 || c.previous !== 0)` in `mergeCallsByCity`, before (or after) the sort. This keeps the widget dumb — it just renders whatever rows it gets — and keeps the "which cities to show" rule in one place with the merge logic that already owns the DTO.

**Why not filter in SQL.** The empty cities come from the outer `allCities` list joined against per-period counts in JS; filtering in the merge is simpler and needs no query rewrite.

## Risks / Trade-offs

- If every city is empty (e.g., no calls imported yet), the list renders empty. Acceptable — an empty list is the correct representation of "no city has data", and matches the intent.

## Migration Plan

Single-commit edit; no migration or flag.

## Open Questions

_None._
