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

## V2.1 — Автоматизация звонков

**Goal:** calls collect themselves: the webhook is the single live source and imports only fill gaps.

- [ ] Phone number table: `cities → sites → phone_numbers`
- [ ] One `calls` table for webhook and CSV rows
- [ ] Webhook finds or creates the number, then always stores the call
- [ ] CSV import splits rows into new, duplicate and disputed, with a download for disputed rows
- [ ] Migrate history in one night deploy, keeping `*_old` tables until verified
- [ ] Load one fresh CSV to close the period since 2026-07-26 and verify the webhook
