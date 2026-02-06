import type { City } from "../data/utils/validators";

/**
 * Alternative city names for matching
 */
const CITY_ALT_NAMES: Record<string, string[]> = {
  новосибирск: ["нск"],
  "санкт-петербург": ["спб", "петербург"],
  "нижний новгород": ["нижний"],
  екатеринбург: ["екб"],
  "ростов-на-дону": ["ростов"],
  "набережные челны": ["челны"],
};

/**
 * Parse city name from project title
 * Removes "Дезинсекция – " prefix and " – Дезинсекция" suffix
 */
export function parseCityNameFromProject(projectTitle: string): string {
  return projectTitle
    .replace(/^Дезинсекция – /, "")
    .replace(/ – Дезинсекция$/, "")
    .trim()
    .toLowerCase();
}

/**
 * Build a map of city names (including alternatives) to site IDs
 * Since city_id = site_id, we use city.id as site_id
 */
export function buildCityToSiteMap(cities: City[]): Map<string, number> {
  const cityMap = new Map<string, number>();

  cities.forEach((city) => {
    const cityName = city.name.toLowerCase();

    // Primary city name → site_id (which equals city.id)
    cityMap.set(cityName, city.id);

    // Add alternative names
    const altNames = CITY_ALT_NAMES[cityName];
    if (altNames) {
      altNames.forEach((alt) => {
        cityMap.set(alt.toLowerCase(), city.id);
      });
    }
  });

  return cityMap;
}

/**
 * Find site ID by project title
 * Returns null if city not found
 */
export function findSiteIdByProject(
  projectTitle: string,
  cityToSiteMap: Map<string, number>,
): number | null {
  const cityName = parseCityNameFromProject(projectTitle);
  return cityToSiteMap.get(cityName) ?? null;
}
