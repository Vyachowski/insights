import type { Tx } from '@/server/db/transaction'

import {
  chargesDue,
  HOSTING_INTERVAL_MONTHS,
  hostingCharge,
  isValidInterval,
  moscowDay,
  numberCharge,
  parseScheduleForm,
} from '@/server/core/auto-charges'
import { HOSTING_TYPE } from '@/server/core/finance'
import { TELEPHONY_TYPE } from '@/server/core/gudok-history'
import {
  disableHostingSchedule,
  disableSchedule,
  enableHostingSchedule,
  enableSchedule,
  findHostingSchedule,
  findNumberSchedule,
  hasOtherEnabledNumber,
  listActiveSchedules,
  listEnabledHostingSchedules,
  setNextChargeDate,
} from '@/server/db/queries/charge-schedules'
import {
  insertEstimate,
  insertHostingCharge,
  listLastCharges,
  listLastHostingCharges,
} from '@/server/db/queries/expenses'
import { listHostings } from '@/server/db/queries/hostings'
import { listNumbersWithSchedules } from '@/server/db/queries/phone-numbers'
import { transaction } from '@/server/db/transaction'

/** The charges of one schedule due up to today, and how many `write` stored. */
function writeDue(
  tx: Tx,
  { id, ...schedule }: { id: number } & Parameters<typeof chargesDue>[0],
  today: string,
  write: (date: string) => boolean,
) {
  const { dates, nextDate } = chargesDue(schedule, today)
  if (dates.length === 0) return 0

  const written = dates.filter(date => write(date)).length
  setNextChargeDate(tx, id, nextDate)
  return written
}

/**
 * Writes an estimated telephony charge and a real hosting charge for every date
 * due up to today in one transaction, so a failed check writes nothing and the
 * next one repeats it.
 */
export function writeDueCharges() {
  const today = moscowDay(new Date())

  return transaction(tx => {
    const numbers = listActiveSchedules(tx)
    const hostings = listEnabledHostingSchedules(tx)
    let written = 0
    for (const { siteId, amount, ...schedule } of numbers) {
      written += writeDue(tx, schedule, today, date => insertEstimate(tx, { date, siteId, amount, type: TELEPHONY_TYPE }))
    }
    for (const { hostingId, amount, ...schedule } of hostings) {
      written += writeDue(tx, schedule, today, date => insertHostingCharge(tx, { date, hostingId, amount, type: HOSTING_TYPE }))
    }
    return { checked: numbers.length + hostings.length, written }
  })
}

/** Every number with its auto charge and what switching it on offers. Amounts are in rubles. */
export async function listNumberCharges() {
  const lastCharges = transaction(tx => listLastCharges(tx, TELEPHONY_TYPE))
  const bySite = new Map(lastCharges.map(({ siteId, ...charge }) => [siteId, charge]))
  return (await listNumbersWithSchedules()).map(row => numberCharge(row, bySite.get(row.siteId)))
}

export type NumberCharge = Awaited<ReturnType<typeof listNumberCharges>>[number]

/** Every hosting with its auto charge and what switching it on offers. Amounts are in rubles. */
export async function listHostingCharges() {
  const lastCharges = transaction(tx => listLastHostingCharges(tx))
  const byHosting = new Map(lastCharges.map(({ hostingId, ...charge }) => [hostingId, charge]))
  return (await listHostings()).map(row => hostingCharge(row, byHosting.get(row.id)))
}

export type HostingCharge = Awaited<ReturnType<typeof listHostingCharges>>[number]

type ChargeForm = Parameters<typeof parseScheduleForm>[0]

const numberId = (form: ChargeForm) => ({
  provider: String(form.provider ?? ''),
  providerNumberId: String(form.providerNumberId ?? ''),
})

/**
 * Switches a number on, or edits one that is on. The checks run inside the
 * write transaction, so a second number cannot slip in between check and write.
 */
function saveNumberCharge(form: ChargeForm) {
  const schedule = parseScheduleForm(form)
  if ('error' in schedule) return schedule

  const id = numberId(form)
  return transaction(tx => {
    const number = findNumberSchedule(tx, id)
    if (!number) return { error: 'Номер не найден' }
    if (number.siteId === null) return { error: 'Номер без сайта нельзя включить' }
    if (number.intervalDays !== null && !isValidInterval(number.intervalDays)) {
      return { error: 'Некорректный интервал списания' }
    }
    if (hasOtherEnabledNumber(tx, number.siteId, id)) return { error: 'На этом сайте уже включён другой номер' }

    // A mark from before the number was off says nothing about the new run
    enableSchedule(tx, id, number.enabled ? schedule : { ...schedule, noChargePeriodEnd: null })
    return { ok: true, outcome: number.enabled ? 'updated' as const : 'on' as const }
  })
}

/** Stops new estimates. Rows already written stay until a reconciliation run. */
function switchNumberChargeOff(form: ChargeForm) {
  transaction(tx => disableSchedule(tx, numberId(form)))
  return { ok: true, outcome: 'off' as const }
}

export function changeNumberCharge(form: ChargeForm) {
  if (form.intent === 'save') return saveNumberCharge(form)
  if (form.intent === 'switch-off') return switchNumberChargeOff(form)
  return { error: 'Неизвестное действие' }
}

export type NumberChargeResult = ReturnType<typeof changeNumberCharge>

/** Switches a hosting on, or edits one that is on. The interval is not edited. */
function saveHostingCharge(form: ChargeForm) {
  const schedule = parseScheduleForm(form)
  if ('error' in schedule) return schedule

  const hostingId = Number(form.hostingId)
  return transaction(tx => {
    const hosting = findHostingSchedule(tx, hostingId)
    if (!hosting) return { error: 'Хостинг не найден' }

    enableHostingSchedule(tx, { hostingId, intervalMonths: HOSTING_INTERVAL_MONTHS }, schedule)
    return { ok: true, outcome: hosting.enabled ? 'updated' as const : 'on' as const }
  })
}

/** Stops new charges. The schedule row and written rows stay. */
function switchHostingChargeOff(form: ChargeForm) {
  transaction(tx => disableHostingSchedule(tx, Number(form.hostingId)))
  return { ok: true, outcome: 'off' as const }
}

export function changeHostingCharge(form: ChargeForm) {
  if (form.intent === 'save') return saveHostingCharge(form)
  if (form.intent === 'switch-off') return switchHostingChargeOff(form)
  return { error: 'Неизвестное действие' }
}

export type HostingChargeResult = ReturnType<typeof changeHostingCharge>
