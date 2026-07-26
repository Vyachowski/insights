## 1. Shared hook

- [x] 1.1 Extract `usePeriodFilter` from the old data page into `app/hooks/usePeriodFilter.ts`

## 2. New pages

- [x] 2.1 Create `app/routes/finance.tsx` (Доходы + Расходы tabs, import, revenue local-add, expense category filter)
- [x] 2.2 Create `app/routes/traffic.tsx` (Звонки + Метрики tabs, import)
- [x] 2.3 Create `app/routes/branches.tsx` (Города + Сайты tabs)

## 3. Wiring and cleanup

- [x] 3.1 Register `finance`, `traffic`, `branches` routes in `app/routes.ts`
- [x] 3.2 Replace the `Данные` sidebar item with Финансы / Трафик / Филиалы in `app/navigation/index.ts`
- [x] 3.3 Delete `app/routes/data.tsx` and confirm no code references `/data`

## 4. Verify

- [x] 4.1 `npm run typecheck` and `npm run lint` pass
- [x] 4.2 Sidebar shows Сводка · Финансы · Трафик · Филиалы; each page's inner tabs and imports work
