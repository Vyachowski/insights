import { count, eq } from 'drizzle-orm'

import { db } from '../client'
import { hostings, sites } from '../schema'

/** Every hosting with its number of sites. */
export function listHostings() {
  return db
    .select({
      id: hostings.id,
      provider: hostings.provider,
      account: hostings.account,
      siteCount: count(sites.id),
    })
    .from(hostings)
    .leftJoin(sites, eq(sites.hostingId, hostings.id))
    .groupBy(hostings.id)
    .orderBy(hostings.id)
}

export type Hosting = Awaited<ReturnType<typeof listHostings>>[number]
