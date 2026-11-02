import { isValidIsoDate } from './iso-date'
import { toKopecks, toRubles } from './money'

// Expense category of a hosting charge. A single `hosting` expense per
// (date, hostingId) mirrors the unique index on the table. Sits alongside
// TELEPHONY_TYPE in gudok-history.ts.
export const HOSTING_TYPE = 'hosting'

type EntryForm = Record<string, FormDataEntryValue | undefined>

type ParsedEntry =
  | { error: string }
  | { expense: { date: string, siteId: null, hostingId: number, type: string, amount: number } }
  | { revenue: { date: string, siteId: number | null, amount: number } }

function parseHosting(form: EntryForm, amount: number): ParsedEntry {
  const date = String(form.date ?? '')
  if (!isValidIsoDate(date)) return { error: 'Укажите дату' }
  return { expense: { date, siteId: null, hostingId: Number(form.hostingId), type: HOSTING_TYPE, amount } }
}

function parseRevenue(form: EntryForm, siteId: number | null, amount: number): ParsedEntry {
  const date = String(form.date ?? '')
  if (!isValidIsoDate(date)) return { error: 'Укажите дату' }
  return { revenue: { date, siteId, amount } }
}

export function parseEntryForm(form: EntryForm): ParsedEntry {
  const siteIdRaw = String(form.siteId ?? '')
  const siteId = siteIdRaw ? Number(siteIdRaw) : null
  const amountRubles = Number(form.amount)

  if (!Number.isFinite(amountRubles) || amountRubles <= 0) {
    return { error: 'Укажите сумму больше нуля' }
  }
  if (siteId !== null && !Number.isInteger(siteId)) {
    return { error: 'Некорректный сайт' }
  }

  const amount = toKopecks(amountRubles)
  if (form.intent === 'add-hosting') return parseHosting(form, amount)
  if (form.intent === 'add-revenue') return parseRevenue(form, siteId, amount)
  return { error: 'Неизвестное действие' }
}

export function parseRevenueId(form: EntryForm): { id: number } | { error: string } {
  const id = Number(form.id)
  if (!Number.isInteger(id) || id <= 0) return { error: 'Некорректная запись' }
  return { id }
}

export function withRubles<T extends { amount: number }>(rows: T[]): T[] {
  return rows.map(row => ({ ...row, amount: toRubles(row.amount) }))
}
