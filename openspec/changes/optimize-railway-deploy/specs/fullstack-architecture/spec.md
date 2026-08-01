## ADDED Requirements

### Requirement: Lean production runtime image

The deployed runtime image SHALL contain only production `dependencies`; devDependencies SHALL be pruned after the production build completes. The prune step MUST run *after* `react-router build` (the build needs `vite` and `@react-router/dev`, which are devDependencies) and MUST NOT remove any package the production server path imports. Files that are never used at runtime (planning docs under `openspec/`, `.agents/`, `scripts/`, `README.md`, `ROADMAP.md`, test files) SHALL be excluded from the deploy context via `.railwayignore`.

#### Scenario: Runtime image excludes build-only tooling

- **WHEN** the app is built and deployed on Railway
- **THEN** the running image's `node_modules` contains the production `dependencies` only (no `eslint`, `vitest`, `vite`, `drizzle-kit`, or `typescript`), and the server still starts and serves pages

#### Scenario: Prune order preserves the build

- **WHEN** the deploy pipeline runs
- **THEN** `react-router build` runs with all dependencies present, and `npm prune --omit=dev` runs only after the build artifact (`build/`) exists

#### Scenario: Production import paths survive pruning

- **WHEN** devDependencies are pruned and the server starts with `NODE_ENV=production`
- **THEN** every module the production path loads resolves — `server.ts` loads `app/server/*` via `tsx` and `build/server/index.js`, the dev-only `import('vite')` branch is never reached, and migrations apply via the programmatic Drizzle migrator (`drizzle-orm`), not `drizzle-kit`
