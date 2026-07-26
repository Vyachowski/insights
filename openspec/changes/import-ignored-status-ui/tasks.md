## 1. Implement status-aware banner

- [x] 1.1 In `CsvImportModal.tsx`, add a helper that maps `{ created, updated, skipped }` to `'success' | 'ignored' | 'mixed' | 'empty'` (`added = created + (updated ?? 0)`).
- [x] 1.2 Import `AlertTriangle` (and a neutral icon for the empty case) from `lucide-react`.
- [x] 1.3 Replace the always-teal result `Group` with one that picks color (`teal`/`yellow`/`dimmed`) and icon (`CheckCircle`/`AlertTriangle`/neutral) from the computed status; keep the existing comma-joined count message and the red `XCircle` error branch unchanged.

## 2. Verify

- [x] 2.1 `npm run typecheck` and `npm run lint` pass.
- [ ] 2.2 Manually confirm via an import that a fresh file shows green, a re-import of the same file shows amber "ignored", and a partly-new file shows amber with both counts.
