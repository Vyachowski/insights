import { and, eq } from 'drizzle-orm'

import { db } from '../client'
import { phoneNumbers } from '../schema'

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
