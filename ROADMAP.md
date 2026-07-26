# Roadmap

Version-based development plan. Format: one-line goal per version + what's included. When a feature is picked up, it becomes an OpenSpec change (`openspec/changes/`); after implementation it is archived and lands in `openspec/specs/`.

Statuses: `[ ]` not started · `[~]` in progress · `[x]` done.

## V1 — Budget

**Goal:** run the budget — see income and expenses by month and understand where the money goes.

- [x] CSV import for revenue/expenses (Data page)
- [x] Dashboard: business health, weekly metrics, month comparison, yearly profit trend
- [x] Data-page table filters: period (year + month) and expense category
- [x] Dashboard widget: expenses by category

## V2 — Сводка

**Goal:** turn the main page into an at-a-glance summary that answers "растём или падаем, тренд или разовое, кто из городов лидирует" — not a wall of finance numbers (finances move to their own tab later).

- [x] Split the combined `Данные` tab into pages: `Финансы` (доходы/расходы), `Трафик` (звонки/метрики), `Филиалы` (города/сайты)
- [x] Rename the main tab `Финансы` → `Сводка`; drop the old widgets (weekly metrics, month comparison, yearly profit trend chart, city profit share, expenses by category)
- [x] Widget **Итог**: 📉/📈 indicator «Бизнес [сильно] падает/растёт» (word «сильно» when |Δ| ≥ 20%) + hero year-over-year % with `% · абс.` toggle; tooltip shows per-year totals
- [x] Widget **Тренды**: Звонки / Доходы / Расходы, bar with a target line = last year's level over the same year-to-date window (red before the line, green past it; expenses inverted); `% · абс.` toggle
- [x] Widget **Города**: all cities by this-year calls, same "catch up to your own last year" bar; `% · абс.` toggle
- [x] Comparison model: goal = the analogous period of the previous year (Jan 1 → today), 100% = parity; «абс.» = cumulative total since Jan 1
