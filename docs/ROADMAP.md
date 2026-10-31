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

- [x] Phone number table: `cities → sites → phone_numbers`
- [x] One `calls` table for webhook and CSV rows
- [x] Webhook finds or creates the number, then always stores the call
- [x] CSV import splits rows into new, duplicate and disputed, with a download for disputed rows
- [x] Migrate history in one night deploy, keeping `*_old` tables until verified
- [x] Load one fresh CSV to close the period since 2026-07-26 and verify the webhook

## V2.2 — Автосписания

**Goal:** telephony expenses write themselves, so profit is close to right every day, and Gudok confirms them once a quarter.

- [ ] Schedule table and an estimate mark on `expenses`
- [ ] Hourly job writes estimated charges every 30 days, catching up after downtime
- [ ] `Номера` tab in `Филиалы`: switch auto charge on per number, one per site
- [ ] Bookmarklet reconciliation replaces estimates in the period it loaded
- [ ] `Сверено с Гудком до DD.MM` under `Расходы`
- [ ] Admin alerts: no Gudok charge, reconciliation over 90 days old, webhook silent over 24 hours

## V2.3 — Хостинг

**Goal:** hosting costs reach the dashboard through the same auto charge.

- [ ] Hosting entity linked to sites, with one auto charge per hosting
