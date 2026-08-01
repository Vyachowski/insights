## 1. Prune devDependencies from the runtime image

- [x] 1.1 Add repo-root `railpack.json` appending `npm prune --omit=dev` to the Railpack `build` step (`"commands": ["...", "npm prune --omit=dev"]`) — Railway's builder is Railpack, not Nixpacks
- [x] 1.2 Verify locally: `npm ci && npm run build && npm prune --omit=dev`, then boot `NODE_ENV=production node --import tsx server.ts` and confirm it serves and `/health` returns 200
- [x] 1.3 Confirm required runtime packages survive: `npm ls --omit=dev tsx drizzle-orm better-sqlite3 @react-router/express express` resolves with no missing deps
- [x] 1.4 Restore full deps for local dev afterward (`npm install`)

## 2. Trim the deploy context

- [x] 2.1 Add repo-root `.railwayignore` excluding `openspec/`, `.agents/`, `scripts/`, `README.md`, `ROADMAP.md`, and test files (`**/*.test.ts`, `**/*.test.tsx`)
- [x] 2.2 Confirm `.railwayignore` does NOT list `app/`, `build/`, `drizzle/`, `public/`, `data/`, `package.json`, `railway.json`, or `nixpacks.toml`

## 3. Deploy and verify

- [ ] 3.1 Commit both files to `main` and push
- [ ] 3.2 Watch the Railway build log (`railway logs --build`) for the appended `npm prune --omit=dev` step (with `removed` lines) and a clean server boot
- [ ] 3.3 Confirm the deployed app serves pages and `/health` returns 200
