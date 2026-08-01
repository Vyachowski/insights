## 1. Formatting helper

- [x] 1.1 Add `formatNumberDelta(current, previous)` to `app/lib/utils.ts`: `+`/`−` (U+2212) sign + `formatNumber(Math.abs(Math.round(current - previous)))`, empty sign when the rounded diff is 0. Mirror `formatRubDelta`.
- [x] 1.2 Add unit tests in `app/lib/utils.test.ts` covering positive, negative, and zero diffs.

## 2. Pass elapsed months to the widgets

- [x] 2.1 In `app/routes/dashboard.tsx`, pass `elapsedMonths={monthlyProfit.elapsedMonths}` to `<TrendsWidget>` and `<CallsByCityWidget>`.

## 3. Trends widget

- [x] 3.1 In `app/modules/dashboard/TrendsWidget.tsx`, accept an `elapsedMonths: number` prop. In absolute mode, per row show `` `${delta}/мес` `` where `delta` is `formatRubDelta(current/elapsed, previous/elapsed)` for money rows and `formatNumberDelta(current/elapsed, previous/elapsed)` for the calls row (guard elapsed with `|| 1`). Percent-mode tooltip unchanged.

## 4. Calls-by-City widget

- [x] 4.1 In `app/modules/dashboard/CallsByCityWidget.tsx`, accept an `elapsedMonths: number` prop. In absolute mode show `` `${formatNumberDelta(city.current/elapsed, city.previous/elapsed)}/мес` `` (guard elapsed with `|| 1`). Percent-mode tooltip unchanged.

## 5. Verify

- [x] 5.1 Run `npm test`, `npm run lint`, `npm run typecheck`.
- [x] 5.2 Load the dashboard, toggle «абс.» on Trends and Calls-by-City, confirm each tooltip shows the signed per-month difference «…/мес» (not a cumulative total).
