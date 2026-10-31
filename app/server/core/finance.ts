import { toKopecks, toRubles } from './money'

// Manual (non-import) expense category. Hosting is billed once a year per
// site; a single `hosting` expense per (date, siteId) mirrors the unique
// index on the table. Sits alongside TELEPHONY_TYPE in gudok-history.ts.
export const HOSTING_TYPE = 'hosting'

type EntryForm = Record<string, FormDataEntryValue | undefined>

type ParsedEntry =
  | { error: string }
  | { expense: { date: string, siteId: number | null, type: string, amount: number } }
  | { revenue: { date: string, siteId: number | null, amount: number } }

// Shape check plus a round-trip so calendar-invalid dates like 2024-02-30 or
// 2024-13-01 are rejected regardless of the engine's date-parsing leniency.
function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

function parseHosting(form: EntryForm, siteId: number | null, amount: number): ParsedEntry {
  const year = Number(form.year)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { error: 'Укажите год' }
  }
  return { expense: { date: `${year}-01-01`, siteId, type: HOSTING_TYPE, amount } }
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
  if (form.intent === 'add-hosting') return parseHosting(form, siteId, amount)
  if (form.intent === 'add-revenue') return parseRevenue(form, siteId, amount)
  return { error: 'Неизвестное действие' }
}

export function withRubles<T extends { amount: number }>(rows: T[]): T[] {
  return rows.map(row => ({ ...row, amount: toRubles(row.amount) }))
}
