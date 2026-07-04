## Context

Project truth lives in two homes: `specs/README.md` (a single 12KB architecture doc, "Application-Wide Specification") and `openspec/` (adopted recently, specs still empty). The README mixes genres — business goals, tech stack, data model, per-domain architecture, deployment runbook, and dev-process conventions — under one roof. OpenSpec `specs/` are behavioral capability specs (`SHALL` requirements + scenarios), which is a narrower genre. So consolidation is a **decomposition**, not a file move, and only the parts that map to behavioral requirements can become specs cleanly.

This is also the first real use of the OpenSpec workflow on this repo — chosen deliberately because it documents already-implemented reality, so it is low-risk.

## Goals / Non-Goals

**Goals:**
- Author the first two capability specs from existing reality: `development-workflow` (§8, §10, §11) and `api-conventions` (§6.1).
- Remove the migrated sections from `specs/README.md` and repoint `CLAUDE.md:5`.
- Make `development-workflow` the single canonical description of commit/lint/hook rules, resolving the recent duplication without reintroducing it.
- Keep the repo consistent at every commit (each task independently committable).

**Non-Goals:**
- Migrating the reference-heavy sections (§4 data model, §7 frontend architecture, §9 deployment) — they do not map to `SHALL` scenarios without becoming documentation cosplaying as requirements. Deferred.
- Authoring the §2 product-capability specs (financial-health, seo-performance, data-ingestion, goal-tracking) — deferred to follow-up changes.
- Deleting `specs/README.md` entirely — it is trimmed here; deletion waits until every section has a confirmed home.
- Any code, API, or dependency change — specs describe current behavior only.

## Decisions

**Decision: Decompose, don't move.** Split the README by section into the target genre rather than relocating it wholesale.
- *Alternative considered:* drop the whole README into `openspec/specs/` as one doc. Rejected — it isn't a capability spec, and it would make `openspec/specs/` a dumping ground rather than a set of testable capabilities.

**Decision: Two anchor capabilities first — `development-workflow` and `api-conventions`.** They are the sections that already read as enforceable rules (hooks, commitlint, lint, the API envelope), so they convert to `SHALL`+scenario with the least distortion.
- *Alternative considered:* start with a §2 product capability. Rejected for the first change — product specs need more thought about scope; dev-workflow documents settled reality and teaches the format at low risk.

**Decision: One canonical home for commit rules, by role not copy.** `development-workflow/spec.md` = canonical description; `commitlint.config.mjs` = enforcement gate; `CLAUDE.md` = terse always-loaded pointer; `specs/README.md §11` = deleted. This preserves the de-duplication done just before this change (the redundant memory file was already removed).
- *Alternative considered:* leave commit rules in both README §11 and the spec. Rejected — that is the exact drift we are eliminating.

**Decision: `CLAUDE.md:5` points at the trimmed README, not the specs.** Since the README still holds §1–§5, §7, §9, the pointer stays valid; it just no longer implies §6.1/§8/§10/§11 live there. A follow-up change repoints it fully once the README is emptied.

## Risks / Trade-offs

- **Requirement wording drifts from a spec-per-section split** → each spec cites the exact README section it replaces in the tasks, so reviewers can diff old vs. new.
- **A spec asserts behavior that isn't actually implemented** → specs were authored strictly from README text describing shipped behavior; no aspirational requirements added. Anything uncertain stays in the README, not the spec.
- **Partial migration leaves two homes temporarily** → accepted and explicit: this change is scoped to "start", with follow-ups tracked in the proposal's Impact section. The README's remaining sections are unchanged, so nothing is lost.
- **`commit-msg` AI-attribution rule is a convention, not machine-checked** → the spec states it as a rule and notes it isn't enforced by `config-conventional`; a future custom commitlint rule could harden it (out of scope here).

## Migration Plan

1. Land the two capability specs (already drafted as change deltas).
2. Trim the migrated sections (§6.1, §8, §10, §11) from `specs/README.md`, leaving a one-line pointer to `openspec/specs/` where each used to be.
3. Repoint `CLAUDE.md:5` wording so it no longer implies the moved sections live in the README.
4. Sync/archive the change so the deltas fold into `openspec/specs/`.

Rollback: the change is docs-only; reverting the commits restores `specs/README.md` and `CLAUDE.md` with no runtime impact.

## Open Questions

- Final home for §4 (data model) and §7 (frontend architecture): a `data-model` / `frontend-architecture` reference spec, or compress into `config.yaml` context? Resolve in the follow-up change.
- Once §2 product capabilities and §4/§7/§9 are migrated and `specs/README.md` is deleted, does anything still need a plain architecture README, or is `openspec/` + `config.yaml` context sufficient?
