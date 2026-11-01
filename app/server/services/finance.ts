import { parseEntryForm, parseRevenueId, withRubles } from '@/server/core/finance'
import { findHostingSchedule } from '@/server/db/queries/charge-schedules'
import { listExpenses, writeRealExpense } from '@/server/db/queries/expenses'
import { listHostings } from '@/server/db/queries/hostings'
import { deleteRevenue, listRevenues, upsertRevenue } from '@/server/db/queries/revenues'
import { listSites } from '@/server/db/queries/sites'
import { transaction } from '@/server/db/transaction'

/** Only the open tab's rows are loaded. Amounts are in rubles. */
export async function getFinancePage(tab: 'revenue' | 'expenses') {
  const isExpenses = tab === 'expenses'
  const [revenues, expenses, sites, hostings] = await Promise.all([
    isExpenses ? [] : listRevenues(),
    isExpenses ? listExpenses() : [],
    listSites(),
    listHostings(),
  ])
  return {
    revenues: withRubles(revenues),
    expenses: withRubles(expenses),
    sites,
    hostings: hostings.map(({ id, provider, account }) => ({ id, provider, account })),
  }
}

export type HostingOption = Awaited<ReturnType<typeof getFinancePage>>['hostings'][number]

export async function addFinanceEntry(form: Parameters<typeof parseEntryForm>[0]) {
  const entry = parseEntryForm(form)
  if ('error' in entry) return entry

  if ('revenue' in entry) return { ok: true, outcome: await upsertRevenue(entry.revenue) }

  const { expense } = entry
  return transaction(tx => {
    if (!findHostingSchedule(tx, expense.hostingId)) return { error: 'Хостинг не найден' }

    return { ok: true, outcome: writeRealExpense(tx, expense) }
  })
}

export function deleteFinanceEntry(form: Parameters<typeof parseRevenueId>[0]) {
  const parsed = parseRevenueId(form)
  if ('error' in parsed) return parsed

  return { ok: true, outcome: deleteRevenue(parsed.id) }
}
