## 1. Replace the formatter

- [x] 1.1 In `app/lib/utils.ts`, replace `formatDeltaPercent` with `formatYoyDelta(current, previous)`: return «—» when `current === 0 && previous === 0`, «новый» when `previous === 0 && current !== 0`, otherwise the signed rounded percentage plus « к <previous year>» with the year derived from `new Date().getFullYear() - 1`.
- [x] 1.2 Update the three widgets to call `formatYoyDelta` and drop the manual suffix:
  - `TrendsWidget.tsx` — `formatYoyDelta(row.current, row.previous)` (remove « к 2025»).
  - `CallsByCityWidget.tsx` — `formatYoyDelta(city.current, city.previous)` (remove « к 2025»).
  - `MonthlyProfitWidget.tsx` (both spots) — `formatYoyDelta(...)` (remove « к {PREVIOUS_YEAR}»).

## 2. Test

- [x] 2.1 Add a `formatYoyDelta` unit test in `app/lib/utils` (or the calc test file if utils has no test) covering: previous>0 → «±N% к <year>»; previous 0 & current>0 → «новый»; both 0 → «—».

## 3. Verify

- [x] 3.1 `npm run typecheck`, `npm run lint`, and `npm test` pass.
- [x] 3.2 `npm run knip` shows no new unused export (old `formatDeltaPercent` fully removed).
- [ ] 3.3 On prod data, confirm a zero-baseline city (e.g. Красноярск) shows «новый» in its tooltip, not «0% к 2025».
