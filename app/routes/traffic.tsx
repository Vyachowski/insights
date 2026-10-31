import type { Route } from './+types/traffic'

import TrafficScreen from '@/screens/traffic/TrafficScreen'
import { requireUser } from '@/server/auth'
import { listCalls } from '@/server/db/calls'
import { listMetrics } from '@/server/db/metrics'
import { listSites } from '@/server/db/sites'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const isMetrics = new URL(request.url).searchParams.get('tab') === 'metrics'
  const [calls, metrics, sites] = await Promise.all([
    isMetrics ? [] : listCalls(),
    isMetrics ? listMetrics() : [],
    listSites(),
  ])

  return { calls, metrics, sites }
}

export default function TrafficPage({ loaderData }: Route.ComponentProps) {
  return <TrafficScreen {...loaderData} />
}
