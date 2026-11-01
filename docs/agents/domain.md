# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase. This repo has one context.

## Before exploring, read these

- **`docs/architecture.md`**: layer terms and key decisions. Read it before you work in an area they touch.
- **`docs/product-rules.md`**: business terms and the rules the code cannot explain.

## Use the docs' vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as these docs define it.

If the concept you need isn't there, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (add the term to the doc that owns it).

## Flag architecture conflicts

If your output contradicts `docs/architecture.md`, surface it explicitly rather than silently overriding:

> _Contradicts the money rule in `docs/architecture.md`, but worth reopening because…_
