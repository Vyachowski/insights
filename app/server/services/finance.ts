import { parseEntryForm, parseRevenueId, withRubles } from '@/server/core/finance'
import { listExpenses, upsertExpense } from '@/server/db/queries/expenses'
import { deleteRevenue, listRevenues, upsertRevenue } from '@/server/db/queries/revenues'
import { listSites } from '@/server/db/queries/sites'

/** Only the open tab's rows are loaded. Amounts are in rubles. */
export async function getFinancePage(tab: 'revenue' | 'expenses') {
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

export function deleteFinanceEntry(form: Parameters<typeof parseRevenueId>[0]) {
  const parsed = parseRevenueId(form)
  if ('error' in parsed) return parsed

  return { ok: true, outcome: deleteRevenue(parsed.id) }
}
