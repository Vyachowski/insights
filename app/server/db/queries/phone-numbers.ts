import { and, eq, sql } from 'drizzle-orm'

import { db } from '../client'
import { chargeSchedules, phoneNumbers } from '../schema'

const byId = (provider: string, providerNumberId: string) => and(
  eq(phoneNumbers.provider, provider),
  eq(phoneNumbers.providerNumberId, providerNumberId),
)

export async function findPhoneNumber(provider: string, providerNumberId: string) {
  const [number] = await db.select().from(phoneNumbers).where(byId(provider, providerNumberId))
  return number
}

export function listPhoneNumbers(provider: string) {
  return db
    .select({
      name: phoneNumbers.name,
      providerNumberId: phoneNumbers.providerNumberId,
      siteId: phoneNumbers.siteId,
    })
    .from(phoneNumbers)
    .where(eq(phoneNumbers.provider, provider))
}

/** Every number by site, with its schedule fields empty when it has none. */
export function listNumbersWithSchedules() {
  return db
    .select({
      provider: phoneNumbers.provider,
      providerNumberId: phoneNumbers.providerNumberId,
      number: phoneNumbers.number,
      name: phoneNumbers.name,
      siteId: phoneNumbers.siteId,
      enabled: chargeSchedules.enabled,
      nextDate: chargeSchedules.nextDate,
      amount: chargeSchedules.amount,
      noChargePeriodEnd: chargeSchedules.noChargePeriodEnd,
    })
    .from(phoneNumbers)
    .leftJoin(chargeSchedules, and(
      eq(chargeSchedules.provider, phoneNumbers.provider),
      eq(chargeSchedules.providerNumberId, phoneNumbers.providerNumberId),
    ))
    .orderBy(sql`${phoneNumbers.siteId} NULLS LAST`, phoneNumbers.providerNumberId)
}

export async function createPhoneNumber(values: typeof phoneNumbers.$inferInsert): Promise<void> {
  await db.insert(phoneNumbers).values(values)
}

export async function updatePhoneNumber(
  provider: string,
  providerNumberId: string,
  values: { number: string | null, name: string | null },
): Promise<void> {
  await db.update(phoneNumbers).set(values).where(byId(provider, providerNumberId))
}
