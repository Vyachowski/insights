## Context

Railway builds this app with Nixpacks (no Dockerfile). Nixpacks installs all dependencies (`npm ci`), runs the detected build (`npm run build` → `react-router build`), then starts the app with the `railway.json` `startCommand` (`node --import tsx server.ts`). Nixpacks does not prune devDependencies, so the runtime image carries build-only tooling (`vite`, `@react-router/dev`, `drizzle-kit`, `eslint`, `vitest`, `typescript`). `node_modules` is 367 MB.

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

**Prune via `nixpacks.toml` build phase.** Add a repo-root `nixpacks.toml` overriding the build phase to run the build then prune:

```toml
[phases.build]
cmds = ["npm run build", "npm prune --omit=dev"]
```

Overriding `phases.build.cmds` replaces Nixpacks' auto-detected build command, so `npm run build` is listed explicitly first; `npm prune --omit=dev` runs against the already-produced `build/` artifact and strips devDependencies from `node_modules` before the image is finalized.

- *Alternative — multi-stage Dockerfile:* more control (separate build/runtime layers), but adds a Dockerfile to maintain and drops Nixpacks auto-detection. Rejected: the one-line prune achieves the same win with far less to own.
- *Alternative — `railway.json` `build.buildCommand`:* Railway has no separate post-build/prune hook, so the prune would have to be chained into `buildCommand` anyway — same effect, less discoverable than a dedicated `nixpacks.toml`. Rejected for clarity.

**`.railwayignore` for non-runtime files.** Exclude `openspec/`, `.agents/`, `scripts/`, `README.md`, `ROADMAP.md`, and test files. This is a small context-size win, not the main goal; the runtime never reads these.

## Risks / Trade-offs

- **Prune removes a package the prod path needs** → server crash on boot. Mitigation: verify locally with `npm ci && npm run build && npm prune --omit=dev` then boot `NODE_ENV=production node --import tsx server.ts` and confirm it serves; confirm `tsx` remains (`npm ls --omit=dev tsx`).
- **Nixpacks build override drops something it auto-added** → build differs from today. Mitigation: `npm run build` is the only build step Nixpacks runs today, so replicating it plus the prune is behavior-preserving.
- **`.railwayignore` excludes something used at build/runtime** → broken deploy. Mitigation: list only known-inert paths; never include `app/`, `build/`, `drizzle/`, `public/`, `data/`, or config files.

## Migration Plan

1. Add `nixpacks.toml` and `.railwayignore`; commit to `main`.
2. Railway redeploys on push; watch the build log for the prune step and a clean boot.
3. Confirm the app serves and `/health` returns 200.
4. Rollback: revert the commit — config-only change, no data or schema impact.
