## Why

The year-over-year delta label lies when the previous year has no data. `formatDeltaPercent` hardcodes `0%` whenever `previous === 0`, so a city like Красноярск or Ростов-на-Дону — no calls in 2025, real calls in 2026 — shows a healthy green bar (which handles the zero-baseline case) but a tooltip reading «0% к 2025». The bar and the tooltip disagree because only the bar accounts for "there was no prior-year baseline".

## What Changes

- The shared delta label SHALL stop reporting `0%` when there is no prior-year baseline. When the previous-year value is zero and the current is non-zero, it reads «новый»; when both are zero, it reads «—»; otherwise it reads the signed percentage as today.
- The label owns its «к <previous year>» suffix and derives the year from the current date, replacing the hardcoded «2025» in the Trends and Calls-by-City widgets.
- Applies everywhere the label is used: Trends, Calls-by-City, and Monthly-profit tooltips.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `dashboard-summary`: adds how the year-over-year delta label behaves when the previous-year value is zero (no baseline), for the Trends and Calls-by-City percent labels.

## Impact

- `app/lib/utils.ts` — `formatDeltaPercent` becomes `formatYoyDelta(current, previous)` returning the full phrase incl. the no-baseline cases and the year suffix.
- `app/modules/dashboard/{TrendsWidget,CallsByCityWidget,MonthlyProfitWidget}.tsx` — call the new helper, drop the manual «к 2025» / «к {PREVIOUS_YEAR}» suffix.
- `openspec/specs/dashboard-summary/spec.md` — new requirement for the delta label's no-baseline handling.
- Also brings the Monthly-profit widget into line with `dashboard-monthly-revenue`'s existing "no incorrect percent on divide-by-zero" requirement. No DTO, query, or migration change.
