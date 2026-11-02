import { and, eq, isNotNull, ne, or, sql } from 'drizzle-orm'

import { chargeSchedules, hostings, phoneNumbers } from '../schema'

import type { Tx } from '../transaction'

export interface NumberId {
  provider: string
  providerNumberId: string
}

// The join keeps number schedules, and the check holds their interval set
const selectSchedules = (tx: Tx) => tx
  .select({
    id: chargeSchedules.id,
    nextDate: chargeSchedules.nextDate,
    amount: chargeSchedules.amount,
    intervalDays: sql<number>`${chargeSchedules.intervalDays}`,
    noChargePeriodEnd: chargeSchedules.noChargePeriodEnd,
    siteId: phoneNumbers.siteId,
  })
  .from(chargeSchedules)
  .innerJoin(phoneNumbers, and(
    eq(phoneNumbers.provider, chargeSchedules.provider),
    eq(phoneNumbers.providerNumberId, chargeSchedules.providerNumberId),
  ))

/** Enabled schedules whose number has a site. */
export function listChargeableSchedules(tx: Tx) {
  return selectSchedules(tx)
    .where(and(eq(chargeSchedules.enabled, true), isNotNull(phoneNumbers.siteId)))
    .all()
}

export function listEnabledSchedules(tx: Tx) {
  return selectSchedules(tx).where(eq(chargeSchedules.enabled, true)).all()
}

/** Enabled hosting schedules. The check holds their interval set. */
export function listEnabledHostingSchedules(tx: Tx) {
  return tx
    .select({
      id: chargeSchedules.id,
      nextDate: chargeSchedules.nextDate,
      amount: chargeSchedules.amount,
      intervalMonths: sql<number>`${chargeSchedules.intervalMonths}`,
      hostingId: hostings.id,
    })
    .from(chargeSchedules)
    .innerJoin(hostings, eq(hostings.id, chargeSchedules.hostingId))
    .where(eq(chargeSchedules.enabled, true))
    .all()
}

export function setNextChargeDate(tx: Tx, id: number, nextDate: string): void {
  tx.update(chargeSchedules).set({ nextDate }).where(eq(chargeSchedules.id, id)).run()
}

export function updateSchedule(
  tx: Tx,
  id: number,
  values: { nextDate: string, amount: number, noChargePeriodEnd: string | null },
): void {
  tx.update(chargeSchedules).set(values).where(eq(chargeSchedules.id, id)).run()
}

/** A number with its schedule fields, empty when it has no schedule. */
export function findNumberSchedule(tx: Tx, { provider, providerNumberId }: NumberId) {
  return tx
    .select({
      siteId: phoneNumbers.siteId,
      enabled: chargeSchedules.enabled,
      intervalDays: chargeSchedules.intervalDays,
    })
    .from(phoneNumbers)
    .leftJoin(chargeSchedules, and(
      eq(chargeSchedules.provider, phoneNumbers.provider),
      eq(chargeSchedules.providerNumberId, phoneNumbers.providerNumberId),
    ))
    .where(and(eq(phoneNumbers.provider, provider), eq(phoneNumbers.providerNumberId, providerNumberId)))
    .get()
}

export function hasOtherEnabledNumber(
  tx: Tx,
  siteId: number,
  { provider, providerNumberId }: NumberId,
): boolean {
  const row = selectSchedules(tx)
    .where(and(
      eq(chargeSchedules.enabled, true),
      eq(phoneNumbers.siteId, siteId),
      or(ne(phoneNumbers.provider, provider), ne(phoneNumbers.providerNumberId, providerNumberId)),
    ))
    .get()
  return row !== undefined
}

/** Switches the number on with these values. `interval_days` is never written, so it stays as stored. */
export function enableSchedule(
  tx: Tx,
  id: NumberId,
  values: { nextDate: string, amount: number, noChargePeriodEnd?: null },
): void {
  tx.insert(chargeSchedules)
    .values({ ...id, ...values, enabled: true })
    .onConflictDoUpdate({
      target: [chargeSchedules.provider, chargeSchedules.providerNumberId],
      set: { ...values, enabled: true },
    })
    .run()
}

/** Keeps the row: the date and amount stay until the number is switched on again. The no-charge mark goes. */
export function disableSchedule(tx: Tx, { provider, providerNumberId }: NumberId): void {
  tx.update(chargeSchedules)
    .set({ enabled: false, noChargePeriodEnd: null })
    .where(and(eq(chargeSchedules.provider, provider), eq(chargeSchedules.providerNumberId, providerNumberId)))
    .run()
}

/** A hosting with its schedule's state, empty when the hosting is unknown. */
export function findHostingSchedule(tx: Tx, hostingId: number) {
  return tx
    .select({ enabled: chargeSchedules.enabled })
    .from(hostings)
    .leftJoin(chargeSchedules, eq(chargeSchedules.hostingId, hostings.id))
    .where(eq(hostings.id, hostingId))
    .get()
}

/**
 * Switches the hosting on with these values. The insert names `interval_days`,
 * because its default of 30 would break the shape check, and a stored interval stays.
 */
export function enableHostingSchedule(
  tx: Tx,
  { hostingId, intervalMonths }: { hostingId: number, intervalMonths: number },
  values: { nextDate: string, amount: number },
): void {
  tx.insert(chargeSchedules)
    .values({ hostingId, intervalMonths, intervalDays: null, ...values, enabled: true })
    .onConflictDoUpdate({ target: chargeSchedules.hostingId, set: { ...values, enabled: true } })
    .run()
}

/** Keeps the row: the date and amount stay until the hosting is switched on again. */
export function disableHostingSchedule(tx: Tx, hostingId: number): void {
  tx.update(chargeSchedules).set({ enabled: false }).where(eq(chargeSchedules.hostingId, hostingId)).run()
}
