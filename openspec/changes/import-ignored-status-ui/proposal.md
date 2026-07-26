## Why

The import result feedback is always green with a checkmark, even when every row was skipped as a duplicate — so "nothing was added" looks the same as "everything was added". Users can't tell at a glance whether an import actually changed data or was fully ignored.

## What Changes

- Make the import result banner reflect the outcome instead of always rendering green:
  - **Success (green + check)**: at least one row was created or updated and nothing was skipped.
  - **Ignored (yellow/amber + warning icon)**: all affected rows were skipped (duplicates) — no new data.
  - **Mixed (amber + count breakdown)**: some rows created/updated and some skipped — show both counts, e.g. `+12 создано, 3 пропущено`.
  - **Error (red + X)**: import failed (unchanged from today).
- Apply this to every import (calls, revenue, expenses, metrics) — they all flow through the same modal and `{ created, updated, skipped }` result shape, so the change is a single rendering rule.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `data-import`: the requirement that the page renders `{ created, skipped }` gains a rule that the rendered feedback (color, icon, message) is derived from the outcome — added vs. fully-ignored vs. mixed vs. error.

## Impact

- `app/components/ui/CsvImportModal.tsx` — the only affected file; result-banner branch computes a status from the counts and picks color/icon/message accordingly.
- No server, schema, or DTO change: `ImportResultDto` already carries `created`, `updated?`, and `skipped`.
