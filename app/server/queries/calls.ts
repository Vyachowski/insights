import { and, eq } from 'drizzle-orm'

import { db } from '@/server/db'
import { calls, cities, phoneNumbers, sites } from '@/server/schema'

export function listCalls() {
  return db
    .select({
      id: calls.id,
      date: calls.date,
      src: calls.src,
      callNumber: calls.callNumber,
      source: calls.source,
      city: cities.name,
      channel: phoneNumbers.name,
    })
    .from(calls)
    .leftJoin(sites, eq(calls.siteId, sites.id))
    .leftJoin(cities, eq(sites.cityId, cities.id))
    .leftJoin(phoneNumbers, and(
      eq(calls.provider, phoneNumbers.provider),
      eq(calls.providerNumberId, phoneNumbers.providerNumberId),
    ))
    .orderBy(calls.id)
}
