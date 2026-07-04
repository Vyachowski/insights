# app Specification

## Purpose
Application-wide structure: the npm-workspace monorepo layout, the shared-contracts (DTO) convention, the City → Site portfolio schema with company-vs-site financial split, and the automated Railway deployment flow.

## Requirements
### Requirement: Workspace and Repository Layout
The project SHALL be structured as a monorepo using npm workspaces containing:
- `apps/backend/`: NestJS REST API
- `apps/frontend/`: React SPA (Vite, Mantine UI)
- `contracts/`: Shared TypeScript and Zod contracts

#### Scenario: Sub-apps share contracts
- **WHEN** a client request/response type is updated in `contracts/`
- **THEN** both the frontend and backend import the updated type from the same shared workspace

### Requirement: Contract-only shared workspace
The `contracts/` workspace SHALL only define API request and response data transfer objects (DTOs), payload types, and error envelopes. It SHALL NOT replicate database entity models, which are owned by the database schema. All shared models SHALL be standardized to use a `Dto` suffix. Backend DTO classes and DTO wrappers SHALL implement their respective shared contract DTO interfaces.

#### Scenario: API payload types in contracts
- **WHEN** defining API boundaries for an entity (e.g. `Revenue`)
- **THEN** the request/response payloads are defined in `contracts/` as DTO interfaces, and the backend DTO classes implement them

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
The application deployment SHALL target Railway, running database migrations automatically via `prisma migrate deploy` prior to backend server boot.

#### Scenario: Safe database schema updates on deploy
- **WHEN** the backend is deployed to production
- **THEN** migrations run successfully before the NestJS server starts

