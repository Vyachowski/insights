## Why

The main page is a stack of six finance widgets labelled «Финансы», but detailed finances are moving to their own tab. What the owner actually needs from the landing page is a fast morning read: **are we growing or shrinking, is it a trend or a one-off, and which cities lead** — answered in seconds, not a wall of numbers. The current widgets mix altitudes, duplicate the same figure several ways, and read poorly (e.g. stacked «2026 / 2025» average-weekly columns).

## What Changes

- Rename the main tab (UI label `Финансы` → `Сводка`).
- **BREAKING** Remove the current dashboard widgets: weekly financial metrics, monthly profit comparison, yearly profit trend chart, city profit share, and expenses-by-category.
- Keep and simplify the top widget as the **Verdict** widget (UI label «Итог»): a growth indicator reading «Бизнес [сильно] падает/растёт» with a 📉/📈 icon (the qualifier «сильно» shown on a large swing), a hero year-over-year percentage, and a percent/absolute value toggle. The «в этом году» line carries a tooltip with per-year totals.
- Add the **Trends** widget (UI label «Тренды»): three metrics — calls, revenue, expenses — each a bar with a target line at last year's level for the same year-to-date window (fill red until it reaches the line, green past it; expenses inverted). Percent/absolute toggle.
- Add the **Calls-by-City** widget (UI label «Звонки по городам»): every city ranked by this-year call count (the only objective per-city metric available), each with the same "catch up to your own last year" bar. Percent/absolute toggle.
- Establish one comparison model shared across all widgets: **reference = the analogous period of the previous year** (Jan 1 → today vs Jan 1 → same date last year); parity = 100%. Absolute mode shows the cumulative total since Jan 1.

## Capabilities

### New Capabilities

- `dashboard-summary`: the summary main page (UI label «Сводка») — its three widgets (Verdict, Trends, Calls-by-City), the shared year-to-date-vs-previous-year comparison model, the intensity qualifier on the growth indicator, and the percent/absolute value toggle.

### Modified Capabilities

- `dashboard-expenses-by-category`: **removed** — the expenses-by-category widget is dropped from the main page; its requirement is retired.

## Impact

- Routes: `app/routes/dashboard.tsx` (widget composition), navigation label in `app/navigation/`.
- Widgets: `app/modules/dashboard/` — rework `BusinessHealthWidget` into the Verdict widget; remove `WeeklyFinancialMetricsWidget`, `MonthlyProfitComparisonWidget`, `YearlyProfitTrendChart`, `CityProfitShareWidget`, `ExpensesByCategoryWidget`; add Trends and Cities widgets.
- Server: `app/server/queries/dashboard.ts` — replace `getDashboardSummary()` output with year-to-date-vs-previous-year aggregates for profit, calls, revenue, expenses (company-wide) plus per-city calls.
- No schema or migration changes; no new dependencies.
- The detailed finance views are out of scope here (planned as a separate finance tab).
