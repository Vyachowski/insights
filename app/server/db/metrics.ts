import { db } from './client'
import { siteMetrics } from './schema'

export type SiteMetric = typeof siteMetrics.$inferSelect

export function listMetrics() {
  return db.select().from(siteMetrics).orderBy(siteMetrics.id)
}

export async function upsertMetric(
  siteId: number,
  date: string,
  data: Record<string, number>,
): Promise<void> {
  await db
    .insert(siteMetrics)
    .values({ siteId, date, ...data })
    .onConflictDoUpdate({
      target: [siteMetrics.siteId, siteMetrics.date],
      set: data,
    })
}
