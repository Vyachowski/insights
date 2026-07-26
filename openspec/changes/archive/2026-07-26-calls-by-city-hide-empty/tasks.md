## 1. Filter empty cities

- [x] 1.1 In `app/server/queries/dashboard.calc.ts`, in `mergeCallsByCity`, drop cities with `current === 0 && previous === 0` (add a `.filter(c => c.current !== 0 || c.previous !== 0)` in the chain). Keep the descending sort by `current`.

## 2. Verify

- [x] 2.1 `npm run typecheck` and `npm run lint` pass.
- [x] 2.2 If `mergeCallsByCity` has a unit test, add/extend a case asserting an all-zero city is excluded and a one-year-only city is kept.
- [x] 2.3 Run the app; confirm the Calls-by-City widget shows only cities with calls in this or last year.
