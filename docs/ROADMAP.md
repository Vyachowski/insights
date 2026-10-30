# Roadmap

What we build in each version. Each version has a one-line goal and a list of features.

Statuses: `[ ]` not started · `[~]` in progress · `[x]` done.

## V1 — Budget

**Goal:** run the budget: see income and expenses by month and understand where the money goes.

- [x] CSV import for revenue and expenses
- [x] Dashboard: business health, weekly metrics, month comparison, yearly profit trend
- [x] Table filters: period (year + month) and expense category
- [x] Dashboard widget: expenses by category

## V2 — Сводка

**Goal:** turn the main page into an at-a-glance summary that answers: are we growing or shrinking, is it a trend or a one-off, and which cities lead.

- [x] Split the combined `Данные` tab into `Финансы`, `Трафик` and `Филиалы`
- [x] Rename the main tab `Финансы` → `Сводка` and drop the old widgets
- [x] Widget `Итог`: growth indicator and hero year-over-year figure
- [x] Widget `Тренды`: `Звонки`, `Доходы`, `Расходы` against last year's level
- [x] Widget `Звонки по городам`: cities ranked by this year's calls
- [x] Widget `Прибыль по месяцам`: monthly profit against last year
- [x] Shared comparison model (see `docs/product-rules.md`)
