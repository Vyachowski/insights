## Context

All work is confined to `app/modules/dashboard/VerdictWidget.tsx`. The widget already has the `%`/`абс.` mode toggle (`ValueModeToggle`), a hero `<Text>` that switches between `percentText` and `formatRub(current)` by `mode`, and a dotted-underline label «в этом году» wrapping a single-line `<Tooltip label={...}>`. `current`/`previous` come from `VerdictDto`; no query or DTO change is needed.

## Goals / Non-Goals

**Goals**
- Change the hero label to «в среднем за год», shared across both value modes.
- Make the tooltip stack the two years vertically with aligned amounts.

**Non-Goals**
- No change to what the hero number is (percent vs. absolute stays as-is).
- No backend, DTO, query, or data-shape changes.
- No change to the other summary widgets.

## Decisions

**Label text.** Replace the literal string «в этом году» with «в среднем за год». The label lives outside the `mode` conditional, so a single string change covers both modes. Keep the dotted-underline `cursor: help` affordance.

**Tooltip layout.** Replace the inline string label

```tsx
label={`${CURRENT_YEAR}: ${formatRub(current)} · ${PREVIOUS_YEAR}: ${formatRub(previous)}`}
```

with a JSX `<Stack gap={2}>` of two rows, one year each. Each row is a `<Group justify="space-between">` (or a two-column grid) so the year sits on the left and the amount is right-aligned; stacking the two rows puts the amounts in a column with digits lining up for easy magnitude comparison. Current year first, matching the tooltip pattern already used in `MonthlyProfitWidget`.

**Wording note.** The product owner chose «в среднем за год»; the spec's Verdict requirement keeps its «average weekly profit» framing. This change is copy-only and does not alter the computed figure, so no reconciliation of the underlying metric is in scope here.

## Risks / Trade-offs

- Minimal risk: string + markup only. The dotted-underline label must keep wrapping the same tooltip trigger so the hover affordance is unchanged.

## Migration Plan

Single-commit edit; no migration, flag, or rollout steps.

## Open Questions

_None._
