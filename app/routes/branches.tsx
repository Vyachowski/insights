import type { Route } from './+types/branches'

import { requireAdmin, requireUser } from '@/routes/helpers/auth'
import BranchesScreen from '@/screens/branches/BranchesScreen'
import { listCities } from '@/server/db/queries/cities'
import { listSites } from '@/server/db/queries/sites'
import { changeNumberCharge, listNumberCharges } from '@/server/services/auto-charges'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const [sites, cities, numbers] = await Promise.all([listSites(), listCities(), listNumberCharges()])

  return { sites, cities, numbers }
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)
  const result = changeNumberCharge(Object.fromEntries(await request.formData()))
  return Response.json(result, { status: 'error' in result ? 400 : 200 })
}

export default function BranchesPage({ loaderData }: Route.ComponentProps) {
  return <BranchesScreen {...loaderData} />
}
