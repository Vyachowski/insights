import type { Route } from './+types/finance'

import FinanceScreen from '@/screens/finance/FinanceScreen'
import { requireAdmin, requireUser } from '@/server/auth'
import { addFinanceEntry, getFinancePage } from '@/server/services/finance'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  const isExpenses = new URL(request.url).searchParams.get('tab') === 'expenses'
  return getFinancePage(isExpenses ? 'expenses' : 'revenue')
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)
  const result = await addFinanceEntry(Object.fromEntries(await request.formData()))
  return Response.json(result, { status: 'error' in result ? 400 : 200 })
}

export default function FinancePage({ loaderData }: Route.ComponentProps) {
  return <FinanceScreen {...loaderData} />
}
