import type { Route } from './+types/branches'

import BranchesScreen from '@/screens/branches/BranchesScreen'
import { requireUser } from '@/server/auth'
import { listCities } from '@/server/db/queries/cities'
import { listSites } from '@/server/db/queries/sites'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const [sites, cities] = await Promise.all([listSites(), listCities()])

  return { sites, cities }
}

export default function BranchesPage({ loaderData }: Route.ComponentProps) {
  return <BranchesScreen {...loaderData} />
}
