# app Specification

## Purpose
Application-wide structure: the flat single-package repository layout, the City → Site portfolio schema with company-vs-site financial split, and the automated Railway deployment flow.

## Requirements
### Requirement: Workspace and Repository Layout
The project SHALL be a flat single-package repository (no npm workspaces): one root `package.json`, the React Router 7 app under `app/` (routes, modules, server code), Drizzle migrations under `drizzle/`, and OpenSpec docs under `openspec/`.

#### Scenario: Single install and dev flow
- **WHEN** a developer clones the repo and runs `npm install && npm run dev`
- **THEN** one package installs and one dev server starts, with no workspace flags or cross-package wiring

### Requirement: Centralized portfolio schema
The database SHALL group `Site` records under a `City` parent, allowing metrics, calls, revenue, and expenses to roll up to the city level.
- `City` has a unique slug and code.
- `Site` has counter IDs, URL, and a group.

#### Scenario: Metric rollup to city
- **WHEN** a metric or call is recorded for a site
- **THEN** it rolls up to its parent city in dashboard views

### Requirement: Financial level split
`Revenue` and `Expense` records SHALL support an optional `siteId`. A null value denotes a company-level financial entry.

#### Scenario: Company-level revenue entry
- **WHEN** revenue has a null `siteId`
- **THEN** it is aggregated as company-wide revenue

### Requirement: Automated platform deployment
The application deployment SHALL target Railway, applying database migrations automatically via the programmatic Drizzle migrator in the server entry, before bootstrap and before the server begins accepting requests.

#### Scenario: Safe database schema updates on deploy
- **WHEN** the app is deployed to production
- **THEN** pending Drizzle migrations are applied before the server starts serving requests
