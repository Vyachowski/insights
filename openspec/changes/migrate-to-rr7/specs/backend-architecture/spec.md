# backend-architecture Specification (delta)

## REMOVED Requirements

### Requirement: Domain modules are self-contained

**Reason**: NestJS is removed; there are no Nest modules/controllers/services/DTOs.
**Migration**: Domain logic lives in `app/server/queries/` (reads) and route actions (mutations); see `fullstack-architecture`.

### Requirement: Cross-cutting concerns live in common/

**Reason**: Guards, interceptors, and filters were Nest constructs. Response/error envelopes no longer exist.
**Migration**: Auth guards become `requireUser`/`requireAdmin` loader helpers; errors flow through route error boundaries; shared CSV utils move to `app/server/imports/`.

### Requirement: Database and config access are centralized

**Reason**: `PrismaService` and Nest `ConfigModule` are removed with Nest and Prisma.
**Migration**: Single Drizzle client in `app/server/db.ts`; zod env validation in `app/server/env.ts` (same schema, ported).
