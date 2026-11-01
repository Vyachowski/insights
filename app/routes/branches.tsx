import type { Route } from './+types/branches'

import { requireUser } from '@/routes/helpers/auth'
import BranchesScreen from '@/screens/branches/BranchesScreen'
import { listCities } from '@/server/db/queries/cities'
import { listSites } from '@/server/db/queries/sites'
import { listNumberCharges } from '@/server/services/auto-charges'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const [sites, cities, numbers] = await Promise.all([listSites(), listCities(), listNumberCharges()])

  return { sites, cities, numbers }
}

export default function BranchesPage({ loaderData }: Route.ComponentProps) {
  return <BranchesScreen {...loaderData} />
}
