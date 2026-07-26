import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  route('health', 'routes/health.tsx'),
  route('import', 'routes/import.ts'),
  route('webhooks/gudok/:secret', 'routes/webhooks.gudok.$secret.ts'),
  route('webhooks/gudok/expenses/:secret', 'routes/webhooks.gudok.expenses.$secret.ts'),
  route('webhooks/gudok/expenses/:secret/since', 'routes/webhooks.gudok.expenses.$secret.since.ts'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  layout('routes/app-layout.tsx', [
    index('routes/home.tsx'),
    route('dashboard', 'routes/dashboard.tsx'),
    route('finance', 'routes/finance.tsx'),
    route('traffic', 'routes/traffic.tsx'),
    route('branches', 'routes/branches.tsx'),
  ]),
] satisfies RouteConfig
