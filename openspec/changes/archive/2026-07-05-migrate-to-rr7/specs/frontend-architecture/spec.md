# frontend-architecture Specification (delta)

## REMOVED Requirements

### Requirement: Layered one-directional data flow

**Reason**: The axios → thunk → slice → selector pipeline mirrored server state client-side; loaders make that mirror unnecessary.
**Migration**: Server data arrives via `useLoaderData`; mutations via actions. See `fullstack-architecture`.

### Requirement: Selectors are mandatory for reads

**Reason**: Redux store for server state is removed.
**Migration**: Components read typed loader data directly; remaining UI state is local state/context.

### Requirement: Components dispatch, never fetch

**Reason**: There is nothing to dispatch to; the fetch layer itself is gone.
**Migration**: Components submit forms (`<Form>`/`useFetcher`) and navigate; the router invokes loaders/actions server-side.

### Requirement: Container / View split for complex sections

**Reason**: The split existed to isolate Redux wiring from presentation. Without a store, the indirection loses its purpose.
**Migration**: Ported page components keep their internal structure but no container/view convention is mandated.

### Requirement: Routing is guarded by auth state

**Reason**: Client-side guard components (`GuestRoute`/`ProtectedRoute`) reading Redux auth state are replaced by server-side checks.
**Migration**: `requireUser` in protected layout loaders; the login route's loader redirects authenticated users. See `fullstack-architecture`.
