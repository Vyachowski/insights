import { normalizeCalls } from '../normalizers';
import { parseCSV } from '../parsers';
import { seedCalls } from '../seeders';
import { validateCallImportData } from '../validators';
import { CallImportSchema } from '../schemas';
import { mapCallsToDomain } from '../mappers';
import { importSites } from './import-sites';

export async function importCalls(
  callsPath: string,
  sitesWithCityName: Awaited<ReturnType<typeof importSites>>,
) {
  const callsImport = parseCSV(callsPath, CallImportSchema);
  const normalizedCalls = normalizeCalls(callsImport);
  const mappedCalls = mapCallsToDomain(normalizedCalls, sitesWithCityName);
  const validatedCalls = validateCallImportData(mappedCalls);

  await seedCalls(validatedCalls);
}
