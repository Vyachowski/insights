## Context

`VerdictWidget.tsx` renders the hero as `mode === 'pct' ? percentText : formatRub(current)`. `current`/`previous` in `VerdictDto` are the **total** profit for the year-to-date window (current year vs previous year, same window) — see `getDashboardSummary` → `computeVerdict(current.profit, previous.profit)`. So today's absolute hero is the whole total (233 135 ₽), and even a raw `current − previous` would be the full year-over-year swing, not a per-month rate.

The dashboard already computes the per-month numbers the owner actually wants: `fetchMonthlyProfit` returns `averageCurrent`/`averagePrevious` — average monthly profit through `elapsedMonths` (the latest month with data) — in `MonthlyProfitDto` (`dashboard.ts:165-176`). Their difference is exactly "how much per month, on average, we make more/less than last year".

## Goals / Non-Goals

**Goals:**
- Absolute-mode hero = signed `averageCurrent − averagePrevious`, suffixed «/мес».
- Tooltip gains one line stating that per-month loss/gain.
- One definition of "elapsed months" across the dashboard (reuse `monthlyProfit`'s).
- Sign and color stay consistent with percent mode.

**Non-Goals:**
- No change to other widgets' absolute mode (Trends, Calls-by-City keep cumulative totals).
- No change to the tooltip's existing per-year total lines.
- No new query, migration, or recomputation — the averages already exist.

## Decisions

- **Reuse existing averages, don't recompute.** Extend `VerdictDto` with `monthlyCurrent` and `monthlyPrevious` (average monthly profit, rubles). Populate them in `getDashboardSummary` from `monthlyProfit.averageCurrent`/`averagePrevious` — do not pass `elapsedMonths` into `computeVerdict` and divide again, which would risk a second, drifting definition of elapsed months. `computeVerdict` stays pure (percent/flags from totals); the spread adds the two fields: `verdict: { ...computeVerdict(...), monthlyCurrent: monthlyProfit.averageCurrent, monthlyPrevious: monthlyProfit.averagePrevious }`.
- **Signed ruble helper.** Add `formatRubDelta(current, previous)` to `app/lib/utils.ts`: `+`/`−` (U+2212, matching the existing percent sign) + `formatRub(Math.abs(diff))`, empty sign for a zero diff. Mirrors `formatYoyDelta`; unit-tested.
- **Hero.** Replace `formatRub(current)` with `` `${formatRubDelta(monthlyCurrent, monthlyPrevious)}/мес` ``. The existing `color = isGrowing ? 'teal' : 'red'` already matches the delta sign, so no color change is needed.
- **Tooltip.** Keep the two per-year total rows; add a row like «в среднем −12 400 ₽/мес» (or «+…») built from the same `formatRubDelta(monthlyCurrent, monthlyPrevious)`.
- **Label unchanged.** Keep «в среднем за год»; the «/мес» suffix on the number disambiguates that the absolute figure is a monthly rate, and the tooltip still lists yearly totals.

## Risks / Trade-offs

- `averageCurrent` (sum of complete months ÷ elapsed months) and `current.profit` (date-window total) can differ for a partial current month. This is intentional: the per-month figure comes from `monthlyProfit` so the Verdict and any monthly view agree, rather than inventing a third number.
- Presentational + a pure helper + two passthrough DTO fields; low risk. The monthly framing is clarified by the «/мес» suffix and the tooltip line.
