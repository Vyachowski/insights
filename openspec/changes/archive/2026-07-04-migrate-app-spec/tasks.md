## 1. Documentation Cleanup

- [x] 1.1 Add warning header to legacy specs/README.md pointing to OpenSpec locations
- [x] 1.2 Trim duplicate details from legacy specs/README.md and replace them with links to OpenSpec specs
- [x] 1.3 Update openspec/config.yaml project context references

## 2. Shared Contracts Refactoring (DTOs Only)

- [x] 2.1 Refactor types under `contracts/` to use DTO names (`RevenueDto`, `SiteDto`, `CityDto`, `ExpenseDto`, `SiteMetricDto`, `CallImportDto`) and update exports in `contracts/index.ts`
- [x] 2.2 Update frontend api, thunks, slices, pages, and components to import and use the new DTO types
- [x] 2.3 Update backend controllers, DTOs, and services to import and use the new DTO types

## 3. Recover architecture rules (§6/§7)

- [x] 3.1 Author `backend-architecture` spec from README §6 (domain-module structure, `common/` cross-cutting, `PrismaService`, config).
- [x] 3.2 Author `frontend-architecture` spec from README §7 (layered data flow, selectors-mandatory, dispatch-not-fetch, container/view, guarded routing).
- [x] 3.3 Reference the two new capabilities from the README stub and `config.yaml`.

## 4. Verification

- [x] 4.1 Run openspec validation to ensure the changes are valid
- [x] 4.2 Run linting (`npm run lint`) to ensure codebase style matches
- [x] 4.3 Run build (`npm run build`) to verify compile success
