import { normalizeCities } from '../normalizers';
import { parseCSV } from '../parsers';
import { CityImportSchema } from '../schemas';
import { seedCities } from '../seeders';
import { validateCitiesData } from '../validators';

export async function importCities(citiesPath: string) {
  const citiesImport = parseCSV(citiesPath, CityImportSchema);
  const normalizedCities = normalizeCities(citiesImport);
  const validatedCities = validateCitiesData(normalizedCities);

  return await seedCities(validatedCities);
}
