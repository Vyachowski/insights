# development-workflow Specification (delta)

## MODIFIED Requirements

### Requirement: Git hooks gate every commit

The project SHALL install git hooks via `simple-git-hooks` (configured in the root `package.json`, activated by the `prepare` script on `npm install`). A `pre-commit` hook SHALL run `lint-staged` (`eslint --fix` on staged `**/*.{ts,tsx}` files only, never the whole tree). A `commit-msg` hook SHALL run `commitlint`. After a fresh clone, `npx simple-git-hooks` MUST be run once to install the hooks.

#### Scenario: Staged file is auto-fixed before commit

- **WHEN** a commit stages a `*.ts`/`*.tsx` file with an auto-fixable lint error
- **THEN** the `pre-commit` hook runs `eslint --fix` on that file before the commit is recorded

#### Scenario: Commit message is validated by the hook

- **WHEN** a commit is created
- **THEN** the `commit-msg` hook runs `commitlint --edit` against the message and blocks the commit on failure

### Requirement: Linting is per-workspace and runnable repo-wide

The repo SHALL have a single flat ESLint 9 config at the root (typescript-eslint type-aware, `@stylistic`, no semicolons, single quotes — continuing the frontend style, which most surviving code comes from), covering both server and client code. `npm run lint` at the root SHALL lint the whole repo.

#### Scenario: Repo-wide lint

- **WHEN** `npm run lint` runs at the repo root
- **THEN** all app code (routes, server modules, components) is linted with the single root config

### Requirement: Feature implementation follows contract → backend → frontend

New features SHALL be implemented loader-first: (1) update the Drizzle schema and generate a migration if the data model changes; (2) implement the query/mutation in `app/server/`; (3) wire it into the route's loader/action; (4) render from `useLoaderData`/`useActionData` in components. Types flow by inference from server code — no shared contract types are written by hand.

#### Scenario: New dashboard field

- **WHEN** a new field is added to a dashboard widget
- **THEN** the query in `app/server/queries/` is extended, the loader returns it, and the component consumes it via typed loader data with no intermediate type definitions

### Requirement: Tests are colocated and run per workspace

Unit tests SHALL be colocated with source as `*.test.ts` and run via `npm test` (vitest). Server-only logic (bootstrap, CSV parsing/import mappers, auth helpers) SHALL be the primary test surface; UI snapshots are not required.

#### Scenario: Unit tests run via vitest

- **WHEN** `npm test` runs at the repo root
- **THEN** the colocated `*.test.ts` files execute via vitest
