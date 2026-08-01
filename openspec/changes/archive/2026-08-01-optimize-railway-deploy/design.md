## Context

Railway builds this app with **Railpack** (no Dockerfile; confirmed in the build log — the earlier Nixpacks attempt was ignored). Railpack installs all dependencies, runs the detected build (`npm run build` → `react-router build`), then starts the app with the `railway.json` `startCommand` (`node --import tsx server.ts`). Railpack does not prune devDependencies by default (`NPM_CONFIG_PRODUCTION=false`); its deploy image copies the complete `node_modules` from the build step, so build-only tooling (`vite`, `@react-router/dev`, `drizzle-kit`, `eslint`, `vitest`, `typescript`) rides into production. `node_modules` is 367 MB.

The production server needs `tsx`, `drizzle-orm`, `better-sqlite3`, `express`, `@react-router/express`, `argon2`, `aws4fetch`, `csv-parse`, `date-fns`, `dotenv`, `zod`, plus React runtime — all declared under `dependencies`. `vite` is imported in `server.ts` only inside the `!isProduction` branch, so it is never loaded in prod.

## Goals / Non-Goals

**Goals:**
- Ship a runtime image with production `dependencies` only.
- Keep the prune step ordered strictly after the build.
- Trim non-runtime files from the deploy context via `.railwayignore`.

**Non-Goals:**
- No switch to a Dockerfile / multi-stage build.
- No change to `app/`, `build/`, `server.ts`, or runtime behavior.
- No change to which packages are `dependencies` vs `devDependencies`.

## Decisions

**Prune via `railpack.json` build step.** Add a repo-root `railpack.json` appending the prune to Railpack's `build` step with the array-extend syntax:

```json
{
  "$schema": "https://schema.railpack.com",
  "steps": { "build": { "commands": ["...", "npm prune --omit=dev"] } }
}
```

The `"..."` placeholder preserves Railpack's auto-detected build command (`npm run build`); `npm prune --omit=dev` then runs against the already-produced `build/` artifact and strips devDependencies from `node_modules`. Since Railpack's deploy image copies `node_modules` from the build step, the pruned tree is what ships.

- *Alternative — `RAILPACK_PRUNE_DEPS=true` env var:* Railpack's native pruning toggle, but it lives in Railway dashboard/service state (not the repo) and its default prune command isn't documented/verifiable. Rejected: `railpack.json` is versioned, reviewable, and pins the exact command.
- *Alternative — multi-stage Dockerfile:* more control, but adds a Dockerfile to maintain and drops Railpack auto-detection. Rejected: the one-line prune achieves the same win with far less to own.

**`.railwayignore` for non-runtime files.** Exclude `openspec/`, `.agents/`, `scripts/`, `README.md`, `ROADMAP.md`, and test files. This is a small context-size win, not the main goal; the runtime never reads these.

## Risks / Trade-offs

- **Prune removes a package the prod path needs** → server crash on boot. Mitigation: verify locally with `npm ci && npm run build && npm prune --omit=dev` then boot `NODE_ENV=production node --import tsx server.ts` and confirm it serves; confirm `tsx` remains (`npm ls --omit=dev tsx`).
- **Railpack build override drops the auto-detected build** → broken build. Mitigation: the `"..."` placeholder preserves Railpack's auto-detected `npm run build`; only the prune is appended.
- **`.railwayignore` excludes something used at build/runtime** → broken deploy. Mitigation: list only known-inert paths; never include `app/`, `build/`, `drizzle/`, `public/`, `data/`, or config files.

## Migration Plan

1. Add `railpack.json` and `.railwayignore`; commit to `main`.
2. Railway redeploys on push; watch the build log for the prune step and a clean boot.
3. Confirm the app serves and `/health` returns 200.
4. Rollback: revert the commit — config-only change, no data or schema impact.
