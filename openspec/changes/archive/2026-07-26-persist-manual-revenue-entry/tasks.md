## 1. Server: idempotent revenue upsert

- [x] 1.1 Add `app/server/revenues/upsert.ts` with `upsertRevenue({ date, siteId, amount })` → `'created' | 'updated' | 'skipped'`, keyed on `(date, siteId)` with `isNull` for null site, mirroring `upsertExpense`.
- [x] 1.2 Add `app/server/revenues/upsert.test.ts` covering created / updated / skipped and the null-site case.

## 2. Route action

- [x] 2.1 In `app/routes/finance.tsx` `action`, handle `intent === 'add-revenue'`: validate date (`YYYY-MM-DD`, non-empty), amount > 0, optional integer `siteId`; convert rubles → kopecks; call `upsertRevenue`; return `{ ok, outcome }`. Keep `add-hosting` working.

## 3. Modal + view wiring

- [x] 3.1 Update `AddRevenueModal.tsx` to accept `submitting` + `onSubmit(values)` (date, siteId, amount) and reflect the submitting state on the button, like `AddHostingModal`.
- [x] 3.2 Forward `submitting` / `onSubmit` through `RevenueTabView.tsx` props (replace `onModalAdd`).
- [x] 3.3 In `finance.tsx`, add a `revenueFetcher`, submit `{ intent: 'add-revenue', ... }`, and add the toast + `revalidate` effect mirroring hosting.
- [x] 3.4 Remove the client-local revenue `localAdds` / temp-id path now that adds persist.

## 4. Verify

- [x] 4.1 `npm run typecheck`, `npm run lint`, `npm test` pass.
- [x] 4.2 Manual check: add a revenue as admin → row persists after reload; re-add same date/site with new amount → updated (not duplicated); non-admin does not see «Добавить».
