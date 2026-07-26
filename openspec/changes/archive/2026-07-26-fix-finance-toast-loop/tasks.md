## 1. Fix the toast loop

- [x] 1.1 In `app/routes/finance.tsx`, add a `useRef` for each fetcher (revenue, hosting) to remember the last handled `fetcher.data`.
- [x] 1.2 In both result effects, return early when `state !== 'idle'`, `!data`, or `ref.current === data`; otherwise set `ref.current = data` before showing the toast + revalidating.
- [x] 1.3 Remove `revalidator` from both effects' dependency arrays (deps `[fetcher.state, fetcher.data]`); add an eslint-disable-next-line with a short comment if `react-hooks/exhaustive-deps` flags it.

## 2. Verify

- [x] 2.1 `npm run typecheck`, `npm run lint`, `npm test` pass.
- [x] 2.2 Manual check: add a revenue and a hosting entry → exactly one toast each, no repeating stream; the table still refreshes (revalidation works).
