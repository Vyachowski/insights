## Context

The main page today (`app/routes/dashboard.tsx`) stacks six widgets fed by `getDashboardSummary()` in `app/server/queries/dashboard.ts`. It is labelled «Финансы» and mixes headline health with detailed finance breakdowns. Detailed finances are planned to move to their own tab; the landing page should become a fast «Сводка». Data available per city is limited — objective per-city signal is call volume only (revenue/expenses are largely company-level or not reliably per-site). The stack is a single React Router 7 app with Drizzle/SQLite; money is integer kopecks, converted to rubles at the query boundary. A validated visual mockup of the three widgets already exists and drives the layout decisions here.

## Goals / Non-Goals

**Goals:**
- Three widgets — Verdict, Trends, Calls-by-City (UI labels «Итог», «Тренды», «Звонки по городам») — answering "grow or shrink / trend or one-off / which cities lead".
- One shared comparison model: current year-to-date vs the same calendar window last year (100% = parity).
- Consistent interaction: identical `% · абс.` toggle on every widget, default `%`.
- Reuse existing period/aggregation helpers in `dashboard.ts` rather than a new query layer.

**Non-Goals:**
- No dedicated «Финансы» tab in this change (future work).
- No per-city revenue/expenses (data not reliable per city).
- No leads (only calls exist today).
- No schema/migration changes; no anomaly detection or alerting.

## Decisions

**Comparison window = same calendar year-to-date, not full year.** Reference = last year's value over Jan 1 → today. Alternative (full-year target) was rejected: mid-year every metric sits below the full-year total, so everything would read "behind" until December — the user explicitly called this out. Same-window comparison is apples-to-apples and cancels within-year seasonality.

**Target-line bar over overlaid bars.** Each Trends/Calls-by-City row is a single bar with a fixed-position target line at 100% (last year's same-window level); fill = thisYear / lastYear scaled to that line. The target line is a dashed vertical marker with a small «2025» label so its meaning is self-evident (in the cities list, all lines share one x-position, so a single label on the top row annotates the whole column). Alternative (two overlaid bars, this year + a ghost of last year) was prototyped and rejected as harder to read — two bars compete for attention. The single bar answers "did we catch up?" directly.

**Color encodes goal attainment, semantic not accent.** Calls/revenue and city bars: red below the line, green at/past it. Expenses inverted: green below, red past. Colors come from semantic tokens (good/bad), separate from the app accent.

**Values on hover, not standing.** Trends and Calls-by-City rows show only the bar (and city name); the exact figure appears in a small bubble on bar hover, in the mode selected by the widget's toggle. The bar's fill already carries the comparison; a permanent number column read as clutter next to it. The Verdict widget keeps its figure standing (it is the page's headline).

**Profit lives only in Итог.** Profit is derived (revenue − expenses) and can cross zero, which breaks a ratio bar (negative fill). Rather than special-casing a diverging bar, profit is excluded from Тренды and shown once, as the Итог hero. Revenue and expenses bars already explain how profit moved.

**Intensity qualifier by threshold.** «сильно» is inserted when |year-over-year swing| ≥ 20%; sign picks растёт/падает. 20% is a tunable constant, chosen as the boundary between "gradual" and "notable".

**Value toggle as a shared component.** A small segmented `% · абс.` control, default `%`, in each card's top-right, identical across all three widgets. `%` = share-of-reference / YoY percent; `абс.` = cumulative total since Jan 1. The loader sends both numbers; the client switches which is shown (standing figure in the Verdict widget, hover bubble in Trends/Calls-by-City).

**Cities ranked by this-year calls.** Ordering matches the absolute number shown and reflects who leads now. Alternative (rank by previous full year) gives a more stable list but mismatches the displayed current-year figure; live leadership won.

## Risks / Trade-offs

- **Zero-crossing profit still looks extreme in Итог** (e.g. −131%) → keep the percentage but let the «в этом году» tooltip carry the raw per-year totals so the magnitude is legible.
- **City ranking reshuffles as data arrives** → acceptable; the list is read for current leaders, not as a fixed roster.
- **20% intensity threshold is a guess** → single named constant, trivially tunable after real-data review.
- **Same-window comparison needs a clean "today" boundary** → reuse the existing `DateService`/period helpers so the cutoff is consistent with other date logic and DATE-as-text lexical comparisons.

## Migration Plan

1. Rework `getDashboardSummary()` to return year-to-date and previous-year same-window aggregates for profit, calls, revenue, expenses (company-wide) plus per-city calls; drop fields only the retired widgets used.
2. Rework `BusinessHealthWidget` into the Verdict widget; add Trends and Calls-by-City widgets; delete the five retired widget modules and their imports.
3. Update the navigation label to «Сводка».
4. Remove the `dashboard-expenses-by-category` widget and retire its spec (delta included).
5. Rollback = revert the change; no data migration, so reverting the code fully restores the prior page.

## Open Questions

- Final wording of the Итог tooltip and the exact «сильно» copy — confirm during implementation against real numbers.
