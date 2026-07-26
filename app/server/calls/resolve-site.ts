import { eq } from 'drizzle-orm'

import { db } from '@/server/db'
import { cities, sites } from '@/server/schema'

// City name aliases used to resolve Gudok project titles to canonical city
// names. Shared by the CSV importer and the webhook ingester so both map a
// project title to a site identically.
const CITY_ALIASES: Record<string, string[]> = {
  новосибирск: ['нск'],
  'санкт-петербург': ['спб', 'петербург'],
  'нижний новгород': ['нижний'],
  екатеринбург: ['екб'],
  'ростов-на-дону': ['ростов'],
  'набережные челны': ['челны'],
}

/** Normalize a raw Gudok project title to a canonical, lowercased city name. */
export function resolveProjectTitle(raw: string): string {
  const cleaned = raw
    .replace(/^Дезинсекция – /, '')
    .replace(/ – Дезинсекция$/, '')
    .trim()
    .toLowerCase()

  for (const [canonical, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.includes(cleaned)) return canonical
  }
  return cleaned
}

/** Load a lowercased-city-name → siteId map for the whole portfolio. */
export async function loadCityToSiteId(): Promise<Map<string, number>> {
  const siteRows = await db
    .select({ id: sites.id, cityName: cities.name })
    .from(sites)
    .innerJoin(cities, eq(sites.cityId, cities.id))
  return new Map(siteRows.map(s => [s.cityName.toLowerCase(), s.id]))
}

/** Resolve a single raw project title to a siteId, or null when unmatched. */
export async function resolveSiteIdByProjectTitle(
  rawTitle: string,
): Promise<number | null> {
  const map = await loadCityToSiteId()
  return map.get(resolveProjectTitle(rawTitle)) ?? null
}
