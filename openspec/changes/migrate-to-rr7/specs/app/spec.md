# app Specification (delta)

## MODIFIED Requirements

### Requirement: Workspace and Repository Layout

The project SHALL be a flat single-package repository (no npm workspaces): one root `package.json`, the React Router 7 app under `app/` (routes, modules, server code), Drizzle migrations under `drizzle/`, and OpenSpec docs under `openspec/`.

#### Scenario: Single install and dev flow

- **WHEN** a developer clones the repo and runs `npm install && npm run dev`
- **THEN** one package installs and one dev server starts, with no workspace flags or cross-package wiring

### Requirement: Automated platform deployment

The application deployment SHALL target Railway, applying database migrations automatically via the programmatic Drizzle migrator in the server entry, before bootstrap and before the server begins accepting requests.

#### Scenario: Safe database schema updates on deploy

- **WHEN** the app is deployed to production
- **THEN** pending Drizzle migrations are applied before the server starts serving requests

## REMOVED Requirements

### Requirement: Contract-only shared workspace

**Reason**: The `contracts/` workspace existed to type the REST seam between frontend and backend. With loaders/actions there is no seam: types flow from server code to components via `useLoaderData` inference.
**Migration**: Shared payload types are deleted; loader/action return types are the source of truth, colocated with the code that produces them.
