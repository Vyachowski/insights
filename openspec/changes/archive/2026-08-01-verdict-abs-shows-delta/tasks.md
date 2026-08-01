## 1. Data (DTO + query)

- [x] 1.1 Add `monthlyCurrent: number` and `monthlyPrevious: number` (average monthly profit, rubles) to `VerdictDto` in `app/lib/types/dashboard.contract.ts`.
- [x] 1.2 In `getDashboardSummary` (`app/server/queries/dashboard.ts`), populate them from `monthlyProfit.averageCurrent`/`averagePrevious` by spreading over `computeVerdict(...)`. Leave `computeVerdict` unchanged (still pure over the totals).

## 2. Formatting helper

- [x] 2.1 Add `formatRubDelta(current, previous)` to `app/lib/utils.ts`: `+`/`−` (U+2212) sign + `formatRub(Math.abs(current - previous))`, empty sign when the diff is 0.
- [x] 2.2 Add unit tests in `app/lib/utils.test.ts` covering positive, negative, and zero diffs.

## 3. Verdict widget

- [x] 3.1 In `app/modules/dashboard/VerdictWidget.tsx`, change the absolute-mode hero to `` `${formatRubDelta(monthlyCurrent, monthlyPrevious)}/мес` ``; confirm the hero color already agrees via the existing `color` variable.
- [x] 3.2 Add a tooltip line stating the average per-month loss/gain (e.g. «в среднем −12 400 ₽/мес»), built from `formatRubDelta(monthlyCurrent, monthlyPrevious)`, keeping the existing per-year total rows.

## 4. Verify

- [x] 4.1 Run `npm test`, `npm run lint`, `npm run typecheck`.
- [x] 4.2 Load the dashboard, toggle «абс.», confirm the Verdict hero shows the signed per-month difference «…/мес» (not the whole total), the tooltip shows the per-month loss/gain line, and sign/color match percent mode.
