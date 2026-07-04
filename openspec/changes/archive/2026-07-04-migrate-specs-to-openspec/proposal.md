## Why

Project truth is split across two homes: `specs/README.md` (a 12KB architecture doc) and `openspec/` (specs + changes, currently empty). Two folders means two things to keep in sync and no single place OpenSpec can treat as the source of truth. This change starts consolidating into `openspec/` as the one home — and doubles as the first real dogfood of the OpenSpec workflow.

## What Changes

- Introduce the first OpenSpec capability specs, authored from existing, already-implemented reality in `specs/README.md`:
  - `development-workflow` — from §8 (Testing), §10 (Development Workflow), §11 (Code Quality & Tooling: ESLint, git hooks, commit messages).
  - `api-conventions` — from §6.1 (base route, auth cookie, response/error envelope, health check).
- Delete the migrated sections from `specs/README.md` (§8, §10, §11, §6.1) once they live in specs.
- Repoint [CLAUDE.md:5](../../../CLAUDE.md) — its "See `specs/README.md`" pointer moves to the new specs / remaining doc.
- **Non-goals (this change):** the reference-heavy sections — §4 Global Data Model, §7 Frontend Architecture, §9 Deployment — are NOT forced into behavioral "SHALL" specs here; they stay in `specs/README.md` and are handled by a follow-up. The product capabilities from §2 (financial-health, seo-performance, data-ingestion, goal-tracking) are also follow-up work. So `specs/README.md` is trimmed, not yet deleted.
- **No commit-rule duplication:** `development-workflow` becomes the canonical description of the commit/lint/hook rules; `commitlint.config.mjs` stays the enforcement gate; CLAUDE.md keeps only a terse pointer. README §11 folds into the spec.

## Capabilities

### New Capabilities
- `development-workflow`: how the repo is built and kept healthy — testing layout, the contract→backend→frontend implementation flow, ESLint per workspace, git hooks (pre-commit lint-staged, commit-msg commitlint), and Conventional Commits enforcement.
- `api-conventions`: cross-cutting backend HTTP contract — `/api/v1` base route, JWT `httpOnly` cookie auth, `{ data }` / `{ error }` response envelopes, and the `/health` check.

### Modified Capabilities
<!-- none — openspec/specs/ is currently empty, so there are no existing requirements to modify. -->

## Impact

- **Docs:** `specs/README.md` loses §6.1, §8, §10, §11 (moved to specs); `openspec/specs/development-workflow/` and `openspec/specs/api-conventions/` created; `CLAUDE.md:5` pointer updated.
- **No code or behavior change:** specs document existing reality; no runtime, API, or dependency changes.
- **Follow-ups unlocked:** later changes migrate §2 product capabilities and decide the home for §4/§7/§9, after which `specs/README.md` can be deleted entirely.
