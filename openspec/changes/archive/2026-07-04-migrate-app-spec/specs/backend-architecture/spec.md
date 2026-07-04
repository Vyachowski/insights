## ADDED Requirements

### Requirement: Domain modules are self-contained

Each backend domain SHALL be a self-contained NestJS module under `apps/backend/src/<domain>/` (e.g. `revenue/`, `calls/`, `metrics/`), containing its `*.module.ts`, `*.controller.ts` (routes, decorators, Swagger), `*.service.ts` (business logic, Prisma calls), colocated `*.spec.ts` tests, and a `dto/` folder of Zod-validated create/update/response DTOs.

#### Scenario: Adding a new domain

- **WHEN** a new domain is added to the backend
- **THEN** it is created as its own module folder with controller, service, colocated specs, and a `dto/` directory

### Requirement: Cross-cutting concerns live in common/

Cross-cutting concerns SHALL live in `apps/backend/src/common/`: `guards/` (`JwtAuthGuard`, `LocalAuthGuard`, `AdminGuard`), `decorators/` (`@CurrentUser()`, `@ApiWrappedResponse()`), `interceptors/` (`ResponseInterceptor`, which wraps every success response in `{ data: T }`), and `filters/` (`AllExceptionsFilter`, which wraps every error in `{ error: { code, message, details? } }`).

#### Scenario: Response wrapping is centralized

- **WHEN** any controller returns a successful result
- **THEN** the `ResponseInterceptor` in `common/interceptors/` wraps it in `{ data: T }` rather than each controller wrapping it

### Requirement: Database and config access are centralized

`apps/backend/src/database/` SHALL hold `PrismaService`, injected into domain services for all database access. `apps/backend/src/config/` SHALL hold env validation (`validation.config.ts`), consumed via `ConfigModule`.

#### Scenario: A service needs the database

- **WHEN** a domain service needs database access
- **THEN** it injects `PrismaService` rather than instantiating a Prisma client directly
