## Context

`app/routes/finance.tsx` persists revenue and hosting adds via two `useFetcher`s. After each submit, a `useEffect` watches `fetcher.state`/`fetcher.data`, and on a settled `ok` result calls `revalidator.revalidate()` (to refresh loader data) plus `notifications.show(...)`. Both effects list `revalidator` in their dependency array.

`useRevalidator()` returns a fresh object whenever revalidation state changes (`idle → loading → idle`). So `revalidate()` mutates that state → new `revalidator` identity → effect re-runs. Because `fetcher.data` persists after the request settles and `fetcher.state` is back to `idle`, the guard `if (state !== 'idle' || !data) return` does not stop the re-run — it fires the toast and revalidates again, forever. Mantine renders at most 5 toasts, hence "по 5 бесконечно".

## Goals / Non-Goals

**Goals:**
- Each fetcher result produces exactly one toast + one revalidation.
- No dependency on the `revalidator` object identity that re-triggers the effect.
- Fix both revenue and hosting handlers.

**Non-Goals:**
- No change to server actions, validation, or the toast copy/colors.
- No change to the notifications provider config.

## Decisions

- **Process each settled result once via a ref.** Keep a `useRef` per fetcher holding the last handled `fetcher.data`. In the effect: return early if `state !== 'idle'`, `!data`, or `ref.current === data`; otherwise set `ref.current = data` and handle (revalidate + toast). Since `fetcher.data` is a new object per completed submission, the ref reliably distinguishes a fresh result from a re-render.
- **Drop `revalidator` from the dependency arrays.** Depend only on `[fetcher.state, fetcher.data]`. `revalidator.revalidate` is called from the render-scope `revalidator`, which is fine without being a dependency; excluding it breaks the identity-change feedback loop. Add an eslint-disable for `react-hooks/exhaustive-deps` on those effects if the rule flags it, with a comment explaining why.
- **Keep both handlers symmetric.** Apply the identical ref-guard pattern to the revenue and hosting effects so they stay easy to read side by side.

## Risks / Trade-offs

- Excluding `revalidator` from deps is intentional; the eslint-disable documents it. Alternative (a `useCallback`-stable revalidate) isn't available from `useRevalidator`, so the ref-guard is the pragmatic fix.
- The ref compares by object identity of `fetcher.data`; React Router returns a new object per completed submission, so identical repeat submissions still produce distinct `data` objects and each is handled once — correct.
