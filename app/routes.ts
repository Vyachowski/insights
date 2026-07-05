import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  route('health', 'routes/health.tsx'),
  route('import', 'routes/import.ts'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  layout('routes/app-layout.tsx', [
    index('routes/home.tsx'),
    route('dashboard', 'routes/dashboard.tsx'),
    route('data', 'routes/data.tsx'),
  ]),
] satisfies RouteConfig
