## 1. Land specs in the new home first

- [ ] 1.1 Run `openspec validate migrate-specs-to-openspec --strict` and fix any format issues in the `development-workflow` and `api-conventions` delta specs.
- [ ] 1.2 Sync the delta specs into `openspec/specs/` (`/opsx:sync migrate-specs-to-openspec`) so both capabilities exist in the new home before the README is trimmed (no dangling-pointer window).

## 2. Trim migrated sections from specs/README.md

- [ ] 2.1 Replace §6.1 (API & Security Conventions) with a one-line pointer to `openspec/specs/api-conventions`.
- [ ] 2.2 Replace §8, §10, §11 (Testing, Development Workflow, Code Quality & Tooling) with a one-line pointer to `openspec/specs/development-workflow`.

## 3. Repoint documentation

- [ ] 3.1 Update the `CLAUDE.md:5` "See specs/README.md" pointer so it reflects the trimmed README and no longer implies the moved sections live there.
- [ ] 3.2 Slim the CLAUDE.md "Git conventions" commit bullets to a terse pointer at `openspec/specs/development-workflow` (canonical), keeping only the always-loaded essentials: Conventional Commits + no AI attribution.

## 4. Finalize

- [ ] 4.1 Run `npm run lint` and `openspec validate --strict` to confirm nothing broke (migration is docs-only).
- [ ] 4.2 Archive the change (`/opsx:archive migrate-specs-to-openspec`) to close it out; specs are already in `openspec/specs/` from 1.2.
