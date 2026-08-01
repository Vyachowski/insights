## Context

Since `verdict-abs-shows-delta`, the Verdict hero in absolute mode reads a signed per-month YoY difference. But Trends and Calls-by-City still show cumulative totals in their absolute-mode **tooltips**:

- `TrendsWidget.tsx`: `mode === 'pct' ? formatYoyDelta(current, previous) : row.format(current)` → e.g. «233 135 ₽», «1 240».
- `CallsByCityWidget.tsx`: `mode === 'pct' ? formatYoyDelta(...) : \`${formatNumber(city.current)} звонков\`` → e.g. «84 звонков».

Only the **tooltip text** is wrong for the абс. mode framing; the bars, colors, and layout stay as-is.

`monthlyProfit.elapsedMonths` (`dashboard.ts:163`) is the shared «latest current-year month with data» count already used to build the Verdict's per-month averages. Dividing any YTD total by it yields a per-month rate on the same time base.

## Goals / Non-Goals

**Goals:**
- Absolute-mode tooltips in Trends and Calls-by-City show the signed average per-month YoY difference, suffixed «/мес».
- One definition of elapsed months across the dashboard (reuse `monthlyProfit.elapsedMonths`).
- Percent-mode tooltips unchanged.

**Non-Goals:**
- No change to bars, colors, labels, or layout — tooltip text only.
- No new query, migration, or recomputation.

## Decisions

- **Reuse `elapsedMonths`, compute per-month client-side.** Per-month YoY difference of a total pair is `(current − previous) / elapsedMonths`. Pass `elapsedMonths` into both widgets as a prop from the loader (`monthlyProfit.elapsedMonths`). Guard against a zero divisor by falling back to 1 (elapsedMonths is always ≥ 1 in practice, but the guard keeps the helper total-safe).
- **Signed count helper.** Add `formatNumberDelta(current, previous)` to `app/lib/utils.ts`: `+`/`−` (U+2212) + `formatNumber(Math.abs(Math.round(diff)))`, empty sign for a zero rounded diff. Mirrors `formatRubDelta`; unit-tested. Money rows reuse the existing `formatRubDelta`.
- **Trends tooltip.** In absolute mode, per row: `` `${delta}/мес` `` where `delta` is `formatRubDelta(current/elapsed, previous/elapsed)` for Доходы/Расходы and `formatNumberDelta(current/elapsed, previous/elapsed)` for Звонки. Because both helpers compute `current − previous` internally, dividing each operand by `elapsed` first yields `(current − previous)/elapsed`.
- **Calls-by-City tooltip.** In absolute mode: `` `${formatNumberDelta(city.current/elapsed, city.previous/elapsed)}/мес` `` .
- **Sign is directional, not good/bad.** For Расходы a `+…/мес` means expenses grew; the bar color already encodes good/bad via the existing `invert` logic, so the tooltip sign just states direction — consistent with how `formatRubDelta` reports a raw difference.

## Risks / Trade-offs

- Reusing the profit-based `elapsedMonths` for call counts means a city whose calls lag/lead the revenue calendar is still divided by the same month count. This is intentional: one shared time base keeps every widget's per-month figure comparable, matching the Verdict decision.
- Presentational + one pure helper + one passthrough prop; low risk.
