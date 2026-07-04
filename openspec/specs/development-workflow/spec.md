# development-workflow Specification

## Purpose
How the Insights repo is built and kept healthy: the contract → backend → frontend implementation flow, per-workspace ESLint, git hooks (pre-commit lint-staged, commit-msg commitlint), Conventional Commits enforcement, and test layout.

## Requirements
### Requirement: Git hooks gate every commit

The project SHALL install git hooks via `simple-git-hooks` (configured in the root `package.json`, activated by the `prepare` script on `npm install`). A `pre-commit` hook SHALL run `lint-staged` (`eslint --fix` on staged `apps/**/*.{ts,tsx}` files only, never the whole tree, resolving each file's nearest workspace flat config). A `commit-msg` hook SHALL run `commitlint`. After a fresh clone, `npx simple-git-hooks` MUST be run once to install the hooks.

#### Scenario: Staged app file is auto-fixed before commit

- **WHEN** a commit stages an `apps/**/*.ts` file with an auto-fixable lint error
- **THEN** the `pre-commit` hook runs `eslint --fix` on that file before the commit is recorded

#### Scenario: Commit message is validated by the hook

- **WHEN** a commit is created
- **THEN** the `commit-msg` hook runs `commitlint --edit` against the message and blocks the commit on failure

### Requirement: Commit messages follow Conventional Commits

Every commit message SHALL follow Conventional Commits (`type(scope): subject`), with `type` required and `scope` free-form (not restricted to a fixed list). This SHALL be machine-enforced by commitlint (`commitlint.config.mjs`, extending `@commitlint/config-conventional`). This spec is the canonical description of the rule; `commitlint.config.mjs` is the enforcement gate and `CLAUDE.md` carries only a pointer.

#### Scenario: Non-conventional message is rejected

- **WHEN** a commit message has no type (e.g. `updated some files`)
- **THEN** commitlint exits non-zero and the commit is blocked

#### Scenario: Conventional message passes

- **WHEN** a commit message is `feat(backend): add health check`
- **THEN** commitlint passes and the commit proceeds

### Requirement: Commits carry no AI attribution

Commit messages SHALL NOT contain AI attribution — no `Co-Authored-By: Claude`, no "Generated with…" lines, no 🤖 markers, and no similar trailers or mentions. (This rule is a convention, not caught by `config-conventional`; it is enforced by authoring discipline.)

#### Scenario: Attribution trailer is stripped before committing

- **WHEN** a drafted commit message contains a `Co-Authored-By: Claude` trailer
- **THEN** the trailer is removed before the commit is made

### Requirement: Linting is per-workspace and runnable repo-wide

Each workspace SHALL own its flat ESLint 9 config (backend: `typescript-eslint` type-aware + Prettier; frontend: `typescript-eslint` recommended + `@stylistic`, no semicolons, single quotes). There SHALL be no shared base config. The whole repo SHALL be lintable from the root via `npm run lint`, which fans out to both workspaces.

#### Scenario: Repo-wide lint fans out to both workspaces

- **WHEN** `npm run lint` runs at the repo root
- **THEN** both the backend and frontend workspaces are linted using their own configs

### Requirement: Feature implementation follows contract → backend → frontend

New features SHALL be implemented in order: (1) define shared types in `contracts/`; (2) implement backend (update schema and run migrations if needed, add routes and validation); (3) implement frontend (`api/` call → thunk → slice → selector → container/view).

#### Scenario: New API field flows contract-first

- **WHEN** a new API field is added
- **THEN** the `contracts/` types are updated first, then the backend, then the frontend consumes it

### Requirement: Tests are colocated and run per workspace

Backend unit tests SHALL be colocated with source as `*.spec.ts` and run via `npm test` (jest) in the backend workspace; the e2e suite SHALL live in `apps/backend/test/`. Shared types in `contracts/` SHALL be validated against the Zod schemas generated from the Prisma schema.

#### Scenario: Backend unit tests run via jest

- **WHEN** `npm test` runs in the backend workspace
- **THEN** the colocated `*.spec.ts` files execute via jest

