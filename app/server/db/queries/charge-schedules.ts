import { and, eq, isNotNull } from 'drizzle-orm'

import { chargeSchedules, phoneNumbers } from '../schema'

import type { Tx } from '../transaction'

/** Enabled schedules whose number has a site. */
export function listActiveSchedules(tx: Tx) {
  return tx
    .select({
      id: chargeSchedules.id,
      nextDate: chargeSchedules.nextDate,
      amount: chargeSchedules.amount,
      intervalDays: chargeSchedules.intervalDays,
      siteId: phoneNumbers.siteId,
    })
    .from(chargeSchedules)
    .innerJoin(phoneNumbers, and(
      eq(phoneNumbers.provider, chargeSchedules.provider),
      eq(phoneNumbers.providerNumberId, chargeSchedules.providerNumberId),
    ))
    .where(and(eq(chargeSchedules.enabled, true), isNotNull(phoneNumbers.siteId)))
    .all()
}

export function setNextChargeDate(tx: Tx, id: number, nextDate: string): void {
  tx.update(chargeSchedules).set({ nextDate }).where(eq(chargeSchedules.id, id)).run()
}
