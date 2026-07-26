## Why

The Verdict widget («Итог», the top summary widget) labels its hero figure «в этом году», which reads as "this year's value" even though the figure is a year-over-year comparison. The label should convey the yearly-average framing in both value modes. Separately, the hero tooltip lists both years on a single line (`2026: X · 2025: Y`), which makes the two amounts hard to compare at a glance.

## What Changes

- Rename the Verdict hero label from «в этом году» to «в среднем за год». The label is identical in both percent and absolute value modes; only the hero figure itself differs (percentage vs. absolute rubles), as today.
- Restructure the hero tooltip so each year sits on its own line, one under the other, with the amounts aligned for quick visual comparison (instead of the current single inline `2026: X · 2025: Y`).
- No data, query, or DTO changes — copy and layout only, within `VerdictWidget`.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `dashboard-summary`: the Verdict widget requirement changes the hero label text to «в среднем за год» (both modes) and specifies a stacked, aligned tooltip layout for the per-year totals.

## Impact

- `app/modules/dashboard/VerdictWidget.tsx` — label string and tooltip markup.
- `openspec/specs/dashboard-summary/spec.md` — Verdict widget requirement wording (label + tooltip scenario).
- No backend, DTO, or migration impact.
