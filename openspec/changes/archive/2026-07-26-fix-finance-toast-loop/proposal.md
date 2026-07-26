## Why

Adding a revenue or hosting entry on the Финансы page triggers an endless stream of toast notifications (Mantine caps the visible stack at 5, so they appear "по 5 бесконечно"). The result toast is shown once, then never stops. This makes the page unusable after any add.

## What Changes

- Fix the infinite toast loop in `app/routes/finance.tsx`: both the revenue and hosting fetcher result effects re-fire forever.
- Root cause: each effect lists `revalidator` in its dependency array **and** calls `revalidator.revalidate()` inside. `useRevalidator()` returns a new object whenever its state changes, so revalidate → new `revalidator` identity → effect re-runs → `fetcher.data` still present + state `idle` → toast + revalidate again → loop.
- Fix: process each fetcher result exactly once (guard on the settled `fetcher.data` via a ref) and stop depending on the `revalidator` object identity.
- Applies to both the `add-revenue` and `add-hosting` result handlers (same pattern, same file).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `manual-revenue-entry`: pin that the result notification fires exactly once per submission (no repeat/loop). The same fix covers the hosting toast on the expenses tab.

## Impact

- `app/routes/finance.tsx` — rework the two `useEffect` result handlers (revenue + hosting) so they run once per settled fetcher result and don't loop on revalidation.
- No server, schema, or data changes. Purely client-side effect logic.
