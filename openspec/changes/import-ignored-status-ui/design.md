## Context

`CsvImportModal.tsx` renders one result banner after an import. Today it is always green with `CheckCircle`, regardless of counts, and only errors render red. The result carries `{ created, updated?, skipped }` (`ImportResultDto`). All four resources (calls, revenue, expenses, metrics) use this one modal, so the fix is a single rendering rule — no server, DTO, or schema change.

## Goals / Non-Goals

**Goals:**
- Derive banner color/icon/message from the counts so added, ignored, mixed, and error outcomes look different.
- Keep it in one place so all import resources get it for free.

**Non-Goals:**
- No change to what the server computes or returns.
- No per-resource wording or new result fields.

## Decisions

- **Compute a status from counts, not a new server field.** Introduce a small helper (inside the modal) that maps `{ created, updated, skipped }` → `'success' | 'ignored' | 'mixed' | 'empty'`:
  - `added = created + (updated ?? 0)`
  - `added > 0 && skipped === 0` → `success`
  - `added > 0 && skipped > 0` → `mixed`
  - `added === 0 && skipped > 0` → `ignored`
  - else → `empty`
  Rationale: the counts already fully determine the outcome; adding a server field would duplicate state.
- **Colors/icons via Mantine + lucide, matching existing usage.** success → `c="teal"` + `CheckCircle` (as today); ignored/mixed → `c="yellow"` + `AlertTriangle`; empty → `c="dimmed"` + `MinusCircle` (or reuse a neutral tone); error → `c="red"` + `XCircle` (unchanged).
- **Message stays the existing comma-joined count string.** Reuse the current `[created, updated, skipped].filter(...).join(', ')` builder; only color/icon branch on status. Mixed naturally shows both counts already.

## Risks / Trade-offs

- [Amber for both "ignored" and "mixed" could read as identical] → the message text differs (mixed lists a `+N создано` segment; ignored does not), so the counts disambiguate; acceptable for a status banner.
- [`updated` is optional and only some resources set it] → treated as `updated ?? 0`, so resources without updates behave as created-vs-skipped only.
