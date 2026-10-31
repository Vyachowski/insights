import { parseEntryForm, withRubles } from '@/server/core/finance'
import { listExpenses, upsertExpense } from '@/server/db/queries/expenses'
import { listRevenues, upsertRevenue } from '@/server/db/queries/revenues'
import { listSites } from '@/server/db/queries/sites'

/** Only the open tab's rows are loaded. Amounts are in rubles. */
export async function getFinancePage(tab: string | null) {
  const isExpenses = tab === 'expenses'
  const [revenues, expenses, sites] = await Promise.all([
    isExpenses ? [] : listRevenues(),
    isExpenses ? listExpenses() : [],
    listSites(),
  ])
  return { revenues: withRubles(revenues), expenses: withRubles(expenses), sites }
}

export async function addFinanceEntry(form: Parameters<typeof parseEntryForm>[0]) {
  const entry = parseEntryForm(form)
  if ('error' in entry) return entry

  const outcome = 'expense' in entry
    ? await upsertExpense(entry.expense)
    : await upsertRevenue(entry.revenue)
  return { ok: true, outcome }
}
