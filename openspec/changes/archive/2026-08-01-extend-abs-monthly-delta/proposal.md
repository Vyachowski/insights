## Why

The Verdict widget's absolute mode now shows the signed **average per-month year-over-year difference** («−50 139 ₽/мес») instead of a cumulative total (see the archived `verdict-abs-shows-delta` change). The other two summary widgets — Trends and Calls-by-City — still show this year's cumulative total in absolute mode, which isn't as actionable. The owner wants the same per-month framing everywhere: in absolute mode each figure should read **how much per month, on average, the metric differs from last year**.

## What Changes

- In the **Trends** widget's absolute mode, each row's tooltip SHALL show the signed average per-month year-over-year difference (this year's total minus last year's, divided by the elapsed months), suffixed «/мес» — rubles for Доходы/Расходы, a count for Звонки — NOT this year's cumulative total.
- In the **Calls-by-City** widget's absolute mode, each city's tooltip SHALL show the signed average per-month year-over-year call-count difference, suffixed «/мес» — NOT this year's cumulative count.
- All widgets reuse the same «elapsed months» definition (`monthlyProfit.elapsedMonths`), so per-month figures across the dashboard agree.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `dashboard-summary`: the Value mode toggle requirement is generalized so that absolute mode across all three widgets shows the signed average per-month year-over-year difference (not cumulative totals). The Trends and Calls-by-City widget requirements gain the per-month absolute-mode behavior.

## Impact

- `app/lib/utils.ts` — add `formatNumberDelta(current, previous)` (signed count delta), sibling of `formatRubDelta`; unit test.
- `app/lib/types/dashboard.contract.ts` — expose `elapsedMonths` on the summary so the two widgets can compute per-month figures (via a small wrapper DTO or prop).
- `app/routes/dashboard.tsx` — pass `elapsedMonths` to both widgets.
- `app/modules/dashboard/TrendsWidget.tsx`, `app/modules/dashboard/CallsByCityWidget.tsx` — absolute-mode tooltips.
- No data-model, migration, or query-shape change; `elapsedMonths` already exists on `monthlyProfit`.
