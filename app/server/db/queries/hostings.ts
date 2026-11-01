import { count, eq } from 'drizzle-orm'

import { db } from '../client'
import { chargeSchedules, hostings, sites } from '../schema'

/** Every hosting with its number of sites and its schedule fields, empty when it has no schedule. */
export function listHostings() {
  return db
    .select({
      id: hostings.id,
      provider: hostings.provider,
      account: hostings.account,
      siteCount: count(sites.id),
      enabled: chargeSchedules.enabled,
      nextDate: chargeSchedules.nextDate,
      amount: chargeSchedules.amount,
    })
    .from(hostings)
    .leftJoin(sites, eq(sites.hostingId, hostings.id))
    .leftJoin(chargeSchedules, eq(chargeSchedules.hostingId, hostings.id))
    .groupBy(hostings.id)
    .orderBy(hostings.id)
}
