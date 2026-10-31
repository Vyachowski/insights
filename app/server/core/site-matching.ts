// City name aliases used to resolve Gudok project titles to canonical city
// names, so the webhook and the telephony ingest map a title to a site identically.
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
