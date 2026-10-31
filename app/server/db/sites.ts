import { eq } from 'drizzle-orm'

import { db } from './client'
import { cities, sites } from './schema'

export type Site = typeof sites.$inferSelect

export function listSites() {
  return db.select().from(sites).orderBy(sites.id)
}

export async function listSiteIds(): Promise<ReadonlySet<number>> {
  const rows = await db.select({ id: sites.id }).from(sites)
  return new Set(rows.map(({ id }) => id))
}

export async function findSiteIdByGudokProject(projectId: number): Promise<number | null> {
  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(eq(sites.gudokProjectId, projectId))
    .limit(1)
  return site?.id ?? null
}

/** Load a lowercased-city-name → siteId map for the whole portfolio. */
export async function loadCityToSiteId(): Promise<Map<string, number>> {
  const rows = await db
    .select({ id: sites.id, cityName: cities.name })
    .from(sites)
    .innerJoin(cities, eq(sites.cityId, cities.id))
  return new Map(rows.map(s => [s.cityName.toLowerCase(), s.id]))
}

export function countSites() {
  return db.$count(sites)
}

export async function insertSites(values: (typeof sites.$inferInsert)[]): Promise<number> {
  return (await db.insert(sites).values(values).returning()).length
}
