## ADDED Requirements

### Requirement: Layered one-directional data flow

`apps/frontend/src/` SHALL be layered so data flows in one direction: `api/` (axios calls per domain) → `store/thunks/` (`createAsyncThunk` per domain) → `store/slices/` (RTK reducers owning normalized state) → `store/selectors/` (all reads). `hooks/` bridge Redux and cross-cutting concerns into components; `pages/` + `components/` compose and render.

#### Scenario: A domain loads data

- **WHEN** a domain needs to load data
- **THEN** the flow is `api/` → `store/thunks/` → `store/slices/` → `store/selectors/`, never skipping a layer

### Requirement: Selectors are mandatory for reads

Components and hooks SHALL read store state only via `store/selectors/*Selectors.ts`, never by reaching into `useSelector(state => state.slice...)` directly, so that state-shape changes stay isolated to one selector file per slice.

#### Scenario: A component reads slice state

- **WHEN** a component or hook needs a value from a slice
- **THEN** it reads it through a selector in `store/selectors/`, not by indexing raw state inside `useSelector`

### Requirement: Components dispatch, never fetch

Components and hooks SHALL trigger data loading via `dispatch(someThunk())` and SHALL NOT call the `api/` layer directly (e.g. no `sitesApi.fetchAll()` inside a `useEffect`). The `api/` layer SHALL be reachable only from `store/thunks/`. If a domain has no thunk/slice yet, one MUST be added rather than reaching into `api/` from a component.

#### Scenario: A component triggers a load

- **WHEN** a component needs to load domain data
- **THEN** it dispatches a thunk; it does not import or call the `api/` layer directly

### Requirement: Container / View split for complex sections

Complex page sections SHALL be split into a container (owns selectors, thunks, dispatch, loading/error state) and a presentational view (props in, JSX out, no Redux) — e.g. `RevenueTab.tsx` (container) and `RevenueTabView.tsx` (view). Simple widgets MAY stay a single component.

#### Scenario: A tab needs data plus non-trivial rendering

- **WHEN** a tab or widget needs both data-fetching and non-trivial rendering
- **THEN** it is split into a container component and a presentational view component

### Requirement: Routing is guarded by auth state

`router/` SHALL define the routes; `<ProtectedRoute>` and `<GuestRoute>` (in `components/guards/`) SHALL gate access based on `authSlice` state.

#### Scenario: Unauthenticated access to a protected route

- **WHEN** an unauthenticated user navigates to a protected route
- **THEN** `<ProtectedRoute>` blocks access based on `authSlice` state
