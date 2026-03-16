import { normalizeSites } from '../normalizers';
import { parseCSV } from '../parsers';
import { SiteImportSchema } from '../schemas';
import { seedSites } from '../seeders';
import { validateSitesData } from '../validators';

export async function importSites(sitesPath: string) {
  const sitesImport = parseCSV(sitesPath, SiteImportSchema);
  const normalizedSites = normalizeSites(sitesImport);
  const validatedSites = validateSitesData(normalizedSites);

  const importedSiteswithCityName = await seedSites(validatedSites);

  return importedSiteswithCityName;
}
