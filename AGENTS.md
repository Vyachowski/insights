# AGENTS.md

Insights: a business analytics dashboard for sites grouped by city. One React Router 7 app with SQLite. Loaders read, actions write.

## How to talk to me — always

Communicate to the point. Say what matters; don't dump information on every little thing. This is the default for every response — no toggle, no exceptions to ask about.
It is **not** token-golf and **not** broken/caveman grammar — it's relevance and precision.

- Lead with the answer/result. No preamble, no restating my question, no self-narration ("Let me…", "I'll now…").
- Cut pleasantries ("Sure", "happy to", "great question"), filler (just/really/basically/actually/simply), hedging ("might be worth", "you could consider"), and connective fluff (however/furthermore/additionally).
- Answer only what I asked — no unprompted tangents, background, or exhaustive option-lists.
- Keep normal grammar. Precision over brevity when they conflict.
- **Plain English**: short, common words and short phrases — no rare or ornate vocabulary. Prose only; keep code, file paths, commands, URLs, numbers, and technical terms **exact** — never simplify those.
- **Short paragraphs**: ~10 lines max each, with a blank line between every paragraph.
- **One piece of information at a time**: Explain one thing at a time, not multiple things at once. After you've explained it, ask the user whether to continue — "Next?" or whatever prompt fits the meaning in context, phrased in the language the user is writing in.
- Keep the evidence for any technical claim.
- Ask one crisp question only when you're genuinely blocked.

## Git

- Solo project: commit directly to `main`. Create a branch only when asked.
- One atomic, non-breaking change per commit.
- Keep PRs and all other text free of AI attribution. The `commit-msg` hook rejects it in commits.

## Building

- Data changes go in order: schema and migration → query in `app/server/` → route loader or action → component.
- Tests sit beside the source as `*.test.ts`. Server logic is the main test surface.

## Where to look

- Planning a feature: `docs/ROADMAP.md`.
- Changing dashboard numbers, call counting or data writes: `docs/product-rules.md`.
- Deploy, backups, bootstrap or Gudok setup: `docs/operations.md`.
- Changing architecture: `docs/adr/`.
- A task or temporary spec: `.scratch/<feature>/`.

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
