## Why

In the Verdict widget («Итог»), percent mode shows a signed year-over-year delta (e.g. `−5%`), but absolute mode («абс.») shows this year's whole total (e.g. `233 135 ₽`). That whole total isn't actionable — what the owner wants to read at a glance is **how much profit per month, on average, we now make more or less than last year**. The absolute figure should be that signed per-month difference, and the tooltip should spell it out.

## What Changes

- In the Verdict widget's absolute mode, the hero figure SHALL show the **average per-month year-over-year profit difference** (this year's average monthly profit minus last year's, over the elapsed months), signed with `+`/`−` and suffixed «/мес» — not this year's whole total and not the full year-over-year difference.
- The sign and color of the absolute hero SHALL agree with the percent hero (negative → `−`, red; positive → `+`, teal).
- The tooltip SHALL gain a line stating the per-month loss/gain explicitly (e.g. «в среднем −12 400 ₽/мес к 2025»), alongside the existing per-year totals.
- The per-month figures reuse the app's existing average-monthly-profit numbers (`monthlyProfit.averageCurrent`/`averagePrevious`), so there is one definition of "elapsed months" across the dashboard.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `dashboard-summary`: the Verdict widget's absolute-mode hero changes from "this year's absolute total" to "the signed average per-month year-over-year difference", and its tooltip gains the per-month loss/gain line. The generic Value mode toggle requirement is clarified to note the Verdict hero as the exception.

## Impact

- `app/modules/dashboard/VerdictWidget.tsx` — absolute-mode hero branch and tooltip.
- `app/lib/types/dashboard.contract.ts` — `VerdictDto` gains `monthlyCurrent`/`monthlyPrevious` (average monthly profit, rubles).
- `app/server/queries/dashboard.ts` — populate the two new fields from `monthlyProfit.averageCurrent`/`averagePrevious`.
- `app/lib/utils.ts` — signed ruble-delta helper + unit test.
- No data-model, migration, or query-shape change; the underlying averages already exist.
