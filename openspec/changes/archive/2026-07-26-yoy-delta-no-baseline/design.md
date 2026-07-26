## Context

`formatDeltaPercent(current, previous)` in `app/lib/utils.ts` returns a bare percentage string and, critically, hardcodes `percent = 0` in its `previous === 0` branch — so a no-baseline growth renders as «0%». All four call sites (`TrendsWidget`, `CallsByCityWidget`, `MonthlyProfitWidget` ×2) then append a « к 2025» / « к {PREVIOUS_YEAR}» suffix by hand — two of them with the year literally hardcoded as `2025`. Meanwhile `TargetBar` already handles the zero baseline separately (`ratio = previous > 0 ? current / previous : current > 0 ? 1.4 : 0`), which is why the bar looks right while the tooltip is wrong.

## Goals / Non-Goals

**Goals**
- Never show «0%» when there is no prior-year baseline; show «новый» instead.
- Show «—» when both years are zero.
- Keep the signed-percentage behavior for real baselines.
- Remove the hardcoded «2025» so the suffix follows the calendar.

**Non-Goals**
- No change to the bar rendering, DTOs, queries, or the comparison model.
- No change to absolute («абс.») mode.

## Decisions

**Replace `formatDeltaPercent` with `formatYoyDelta(current, previous)`** that returns the complete label including the year suffix, so the no-baseline logic lives in one place instead of being split between the formatter and each call site:

```ts
const PREV_YEAR = new Date().getFullYear() - 1

export const formatYoyDelta = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? '—' : 'новый'
  const percent = Math.round(((current - previous) / Math.abs(previous)) * 100)
  const sign = percent > 0 ? '+' : percent < 0 ? '−' : ''
  return `${sign}${Math.abs(percent)}% к ${PREV_YEAR}`
}
```

Call sites drop their manual suffix: `formatYoyDelta(a, b)` replaces `` `${formatDeltaPercent(a, b)} к 2025` `` (and the `{PREVIOUS_YEAR}` variant).

**Why «новый» over «—» for the growth case.** For calls, `previous === 0 && current > 0` means the city had no calls last year and has some now — real, positive activity. «—» would read as "no data" and hide that; «новый» conveys "appeared this year". The both-zero case keeps «—». This also satisfies `dashboard-monthly-revenue`'s existing requirement that a divide-by-zero not surface an incorrect percent.

**Rename, don't keep both.** Leaving the old `formatDeltaPercent` around would be dead code (knip would flag it), so it is renamed and all imports updated.

## Risks / Trade-offs

- `MonthlyProfitWidget` uses this with profit, which can be negative. `previous === 0 && current < 0` now yields «новый» rather than «0%» — a rare edge (previous month profit exactly 0); «новый» is acceptable and no worse than the old «0%».
- Deriving the year from `new Date()` makes the util time-dependent, matching the existing `CURRENT_YEAR = new Date().getFullYear()` pattern already used across the widgets.

## Migration Plan

Single-commit edit; no migration or flag.

## Open Questions

_None._
