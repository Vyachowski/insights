# Tasks: remove-seed

## 1. Bootstrap module

- [x] 1.1 Extend `validation.config.ts` env schema: add optional `CITIES_CSV_URL`, `SITES_CSV_URL` and the existing `ADMIN_*`/`USER_*` credential vars; remove `YANDEX_API_OAUTH_TOKEN`; update `apps/backend/.env.example` with the new vars and the Google Drive direct-download URL format
- [x] 1.2 Create `src/bootstrap/` module with an `OnApplicationBootstrap` provider: skeleton with step runner that checks table emptiness, logs skip/success/failure per step, and never throws out of startup
- [x] 1.3 Implement users step: create admin + regular user from `ADMIN_*`/`USER_*` env vars with argon2-hashed passwords when `User` table is empty
- [x] 1.4 Implement cities step: fetch CSV via `fetchUrlToBuffer`, parse with a zod row schema (headers matching the existing `cities.csv`), insert with explicit ids when `City` table is empty
- [x] 1.5 Implement sites step: same pattern against `sites.csv` headers, runs only when `Site` is empty and `City` is not
- [x] 1.6 Reset Postgres identity sequences for `City`/`Site` after explicit-id inserts
- [x] 1.7 Unit tests for the bootstrap provider: empty vs populated tables, missing env vars, failed fetch (spec scenarios from `data-import`) — 8/8 pass; fixed jest `moduleNameMapper` (`@/` alias + `.js`→`.ts`), which exposed 19 pre-existing broken scaffold specs (missing PrismaService mocks, out of scope)

## 2. Seed removal

- [x] 2.1 Delete `apps/backend/src/prisma/seed/**` (including `seed_data.zip` and the Metrika fetcher)
- [x] 2.2 Remove `prisma:seed` script and the prisma `seed` config key from `apps/backend/package.json`; remove seed-only deps if any become unused (`npm run knip` to confirm) — also removed `tsx` devDep, `fromSrcRoot` lib helper, and the seed eslint exemption
- [x] 2.3 Fix any imports referencing seed code (e.g. comments in `calls.service.ts` mentioning the seed normalizer); lint + build must pass — knip clean, build green

## 3. Migration squash

- [ ] 3.1 Delete the two existing migration folders and generate a single fresh `init` migration from the current `schema.prisma`
- [ ] 3.2 Recreate local dev DB: `dev:up` → `prisma migrate deploy` → verify schema matches

## 4. Verify clean-slate flow

- [x] 4.1 Upload `cities.csv`/`sites.csv` to Google Drive (anyone-with-link), set URLs in `.env.dev` — done 2026-07-05, both URLs verified byte-identical to Desktop copies; `ADMIN_*`/`USER_*` credentials already present in `.env.dev`
- [ ] 4.2 Start app against the fresh DB; verify users/cities/sites bootstrapped and admin login works
- [ ] 4.3 Upload all data CSVs (calls, revenue, expenses, metrics) via the UI; spot-check dashboard numbers against pre-reset values
- [ ] 4.4 Update `CLAUDE.md` dev commands / README setup section: remove seed step, document bootstrap-then-upload flow

## 5. Production cutover

- [ ] 5.1 Set Railway service variables (CSV URLs + bootstrap credentials); recreate the prod database
- [ ] 5.2 Deploy, confirm bootstrap logs, upload data CSVs via UI, verify dashboard
