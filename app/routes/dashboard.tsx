import type { Route } from './+types/dashboard'

import { requireUser } from '@/routes/helpers/auth'
import DashboardScreen from '@/screens/dashboard/DashboardScreen'
import { getDashboardSummary } from '@/server/services/dashboard'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return getDashboardSummary()
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  return <DashboardScreen {...loaderData} />
}
