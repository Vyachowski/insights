## Why

The Railway runtime image ships every devDependency (eslint, vitest, vite, drizzle-kit, typescript — `node_modules` is 367 MB) even though the running server needs none of them. Nixpacks installs all deps to run `react-router build` but never prunes afterward, so the image carries build-only tooling into production. A leaner image means faster cold starts and less surface running in prod.

## What Changes

- After the production build, prune devDependencies from the runtime image so only `dependencies` remain (`npm prune --omit=dev`, run *after* `react-router build`, never before — the build needs `vite` and `@react-router/dev`).
- Add `.railwayignore` to keep files that are never used at runtime out of the deploy context: `openspec/`, `.agents/`, `scripts/`, docs (`README.md`, `ROADMAP.md`), and test files. Minor size win; main gain is a cleaner context.
- **No change to `app/` or `build/`** — both are required at runtime. `server.ts` loads `app/server/*` (env, startup, backup, db) directly via `tsx`; `build/server/index.js` + `build/client` are the compiled SSR bundle and static assets.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `fullstack-architecture`: the "One deploy unit" requirement gains a rule that the deployed runtime image contains only production dependencies (devDependencies pruned after the build step).

## Impact

- Build config: a nixpacks build customization (`nixpacks.toml` or Railway `build` config) to append `npm prune --omit=dev` after the build; new `.railwayignore` at repo root.
- No application code changes. Runtime deps unchanged: `tsx`, `drizzle-orm`, `better-sqlite3`, `express`, `@react-router/express` stay in `dependencies`.
- Risk: pruning must not remove anything the prod path imports. `vite` is imported only in the dev branch of `server.ts` (guarded by `!isProduction`), so removing it is safe; migrations run via the programmatic Drizzle migrator (`drizzle-orm`), not `drizzle-kit`.
