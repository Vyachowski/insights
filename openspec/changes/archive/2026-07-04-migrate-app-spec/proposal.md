## Why

Migrate the high-level application specification and layout details from the legacy `specs/README.md` to a formal OpenSpec capability named `app`. Clean up the `@insights/contracts` workspace to ensure it only defines API request/response DTOs rather than duplicating database entities.

## What Changes

- Create a new OpenSpec specification `app` under `openspec/specs/app/spec.md`.
- Extract and formalize high-level requirements (monorepo layout, centralized portfolio schema, financial site vs company level split, and automated deployment).
- Recover the backend (§6) and frontend (§7) architecture rules from `specs/README.md` into dedicated `backend-architecture` and `frontend-architecture` capabilities, so the enforceable conventions (module layout, selectors-mandatory, components-dispatch-not-fetch, container/view split) are not lost when the README is trimmed.
- Update the legacy `specs/README.md` to reference the new OpenSpec `app` capability instead of maintaining duplicate definitions.
- Refactor `@insights/contracts` to contain only API data transfer objects (DTOs) and payload contracts rather than raw database entities.
- Update the backend and frontend code to conform to this contracts separation.

## Capabilities

### New Capabilities
- `app`: High-level workspace layout, shared-contracts (DTO) convention, core portfolio schema relationship, financial record hierarchy, and deployment flow.
- `backend-architecture`: NestJS domain-module structure and cross-cutting concerns (`common/` guards, decorators, interceptors, filters; `PrismaService`; config validation).
- `frontend-architecture`: layered one-directional data flow, selectors-mandatory reads, components-dispatch-not-fetch, container/view split, and guarded routing.

### Modified Capabilities

## Impact

- **Affected Files**:
  - `specs/README.md` (legacy spec updated/trimmed).
  - `openspec/specs/app/spec.md` (created).
  - Files under `contracts/` (refactored to focus on API contracts).
  - Backend DTOs and frontend stores/api calls (updated to import correct DTO types).
