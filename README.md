# Insights

A private analytics dashboard for a portfolio of sites grouped by city: revenue, expenses, calls and SEO metrics. Its main page answers one question: is the business growing compared with last year?

Stack: React Router 7, Mantine, Drizzle + SQLite, one Node server on Railway.

## How we work

1. **Plan:** add the feature to the current version in [docs/ROADMAP.md](docs/ROADMAP.md).
2. **Clarify:** run `/grill-me` until the feature is clear.
3. **Slice:** run `/to-tickets` to cut it into tasks under `.scratch/<feature>/issues/`. Add `/to-spec` first if the feature is large. Skip this step for a small feature.
4. **Build:** run `/implement`, one task per clean session.
5. **Finish:** mark the feature `[x]` in the roadmap and move its folder to `.scratch/archive/`.

Commit directly to `main`. A `pre-push` hook runs typecheck and tests.

## Where things live

| Path | Reader | What it holds |
| --- | --- | --- |
| `README.md` | you | how we work |
| `AGENTS.md` | agents | the single entry point: rules and pointers |
| `docs/ROADMAP.md` | you | versions and features |
| `docs/product-rules.md` | both | rules the code cannot explain |
| `docs/operations.md` | both | deploy, backups, Gudok setup |
| `docs/adr/` | both | key architecture decisions |
| `docs/agents/` | agents | setup for the engineering skills |
| `.scratch/` | agents | temporary specs and tasks, hidden from git |

Add new documents only when one is needed. `GLOSSARY.md` and `CODING_STANDARDS.md` do not exist yet: create the glossary when terms get confused, and coding standards when a review misses a mistake no linter could catch.

## Which skill when

| Situation | Skill |
| --- | --- |
| Don't know which skill fits | `/ask-matt` |
| Idea is fuzzy | `/grill-me` |
| Feature takes several sessions | `/to-spec`, then `/to-tickets` |
| Ready to build a task | `/implement` |
| Building one behavior test-first | `/tdd` |
| Something is broken | `/diagnosing-bugs` |
| Need a check before shipping | `/code-review` |
| A build went badly | `/retro` |
| Code feels hard to change | `/improve-codebase-architecture` |

## Run it

```bash
cp .env.example .env
npm install
npm run dev
```

Other commands are in `package.json`.

## License

UNLICENSED (private).
