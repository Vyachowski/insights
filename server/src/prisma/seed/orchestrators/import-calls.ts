import { City } from '@/prisma/generated/prisma/client';
import { normalizeCalls } from '../normalizers';
import { parseCSV } from '../parsers';
import { seedCalls } from '../seeders';
import { validateCallImportData } from '../validators';
import { CallImportSchema } from '../schemas';
import { mapCallsToDomain } from '../mappers';

export async function importCalls(callsPath: string, cities: City[]) {
  const callsImport = parseCSV(callsPath, CallImportSchema);
  const normalizedCalls = normalizeCalls(callsImport);
  const mappedCalls = mapCallsToDomain(normalizedCalls, cities);
  const validatedCalls = validateCallImportData(mappedCalls);

  await seedCalls(validatedCalls);
}
