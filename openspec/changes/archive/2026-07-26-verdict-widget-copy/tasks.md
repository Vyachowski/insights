## 1. Update VerdictWidget

- [x] 1.1 In `app/modules/dashboard/VerdictWidget.tsx`, change the hero label string from «в этом году» to «в среднем за год» (single occurrence, applies to both value modes).
- [x] 1.2 Replace the inline single-line tooltip `label` (`${CURRENT_YEAR}: … · ${PREVIOUS_YEAR}: …`) with a JSX `<Stack gap={2}>` of two rows — current year first, then previous — each a year label (left) and its `formatRub(...)` amount right-aligned, so the amounts stack in an aligned column.

## 2. Verify

- [x] 2.1 `npm run typecheck` and `npm run lint` pass.
- [x] 2.2 Run the app; confirm the Verdict widget shows «в среднем за год» in both `%` and `абс.` modes, and the hover tooltip lists 2026 and 2025 one under the other with aligned amounts.
