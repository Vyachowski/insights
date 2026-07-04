## Context

We are migrating legacy specifications from `specs/README.md` to formal capability specifications under `openspec/specs/`. The first step is to move the application-level details (monorepo layout, global data model, deployment) into the new `app` specification capability. Additionally, we are refactoring the `@insights/contracts` workspace to ensure it only exports API DTOs/contracts rather than mimicking raw database entities.

## Goals / Non-Goals

**Goals:**
- Create the `app` capability specification under `openspec/specs/app/spec.md` defining the monorepo, contracts DTO boundary, data rollup model, and Railway deployment.
- Trim legacy `specs/README.md` to refer readers to the OpenSpec capability spec directory.
- Refactor the `@insights/contracts` package to use DTO naming (e.g., `RevenueDto`, `SiteDto`, `CityDto`, `ExpenseDto`, `SiteMetricDto`, `CallImportDto`) to represent the over-the-wire API contract instead of database entities.
- Update backend services/controllers and frontend slices/thunks/views to use these new DTO names.

**Non-Goals:**
- Making database schema changes or altering active table structures in PostgreSQL.
- Modifying other unrelated specifications (such as `api-conventions`).

## Decisions

### Decision: Rename entity interfaces in `@insights/contracts` to DTOs
To prevent coupling the frontend directly to backend database entity models, we will suffix the shared interfaces with `Dto` (or change them to request/response contracts) to establish that these represent the over-the-wire API contract.
- `Revenue` -> `RevenueDto`
- `Site` -> `SiteDto`
- `City` -> `CityDto`
- `Expense` -> `ExpenseDto`
- `SiteMetric` -> `SiteMetricDto`
- `CallImport` -> `CallImportDto`

### Decision: Update backend controller return/body types and frontend state/API layers
We will systematically rename the imports and usages of these types across both workspaces to ensure type safety.

## Risks / Trade-offs

- **[Risk]** Large blast radius for type changes across the codebase.
  - **Mitigation**: Perform the renaming systematically by workspace, running `npm run build` to verify compiling.
