import type { Route } from './+types/dashboard'

import { requireUser } from '@/server/auth'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return null
}

export default function DashboardPage() {
  return <p>Dashboard — ported in the next task group.</p>
}
