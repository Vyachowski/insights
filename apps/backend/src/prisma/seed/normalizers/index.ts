import type { CityImport, SiteImport } from '../schemas';

export function normalizeCities(citiesImport: CityImport[]) {
  return citiesImport.map((city) => ({
    ...city,
    id: Number(city.id),
    population: Number(city.population),
  }));
}

export function normalizeSites(sitesImport: SiteImport[]) {
  return sitesImport.map((site) => ({
    ...site,
    id: Number(site.id),
    cityId: Number(site.cityId),
  }));
}
