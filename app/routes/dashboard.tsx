import type { Route } from './+types/dashboard'

import DashboardScreen from '@/screens/dashboard/DashboardScreen'
import { requireUser } from '@/server/auth'
import { getDashboardSummary } from '@/server/services/dashboard'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return getDashboardSummary()
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  return <DashboardScreen {...loaderData} />
}
