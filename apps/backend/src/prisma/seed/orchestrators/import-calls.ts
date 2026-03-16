import { normalizeCalls } from '../normalizers';
import { parseCSV } from '../parsers';
import { seedCalls } from '../seeders';
import { validateCallImportData } from '../validators';
import { CallImportSchema } from '../schemas';
import { mapCallsToDomain } from '../mappers';
import { SiteWithCity } from '../types';

export async function importCalls(
  callsPath: string,
  sitesWithCityName: SiteWithCity[],
) {
  const callsImport = parseCSV(callsPath, CallImportSchema);
  const normalizedCalls = normalizeCalls(callsImport);
  const mappedCalls = mapCallsToDomain(normalizedCalls, sitesWithCityName);
  const validatedCalls = validateCallImportData(mappedCalls);

  return await seedCalls(validatedCalls);
}
