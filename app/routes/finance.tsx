import type { Route } from './+types/finance'

import { requireAdmin, requireUser } from '@/routes/helpers/auth'
import FinanceScreen from '@/screens/finance/FinanceScreen'
import { addFinanceEntry, deleteFinanceEntry, getFinancePage } from '@/server/services/finance'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  const isExpenses = new URL(request.url).searchParams.get('tab') === 'expenses'
  return getFinancePage(isExpenses ? 'expenses' : 'revenue')
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)
  const form = Object.fromEntries(await request.formData())
  const result = form.intent === 'delete-revenue' ? deleteFinanceEntry(form) : await addFinanceEntry(form)
  return Response.json(result, { status: 'error' in result ? 400 : 200 })
}

export default function FinancePage({ loaderData }: Route.ComponentProps) {
  return <FinanceScreen {...loaderData} />
}
