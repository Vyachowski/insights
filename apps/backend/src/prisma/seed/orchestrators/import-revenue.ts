import { normalizeRevenue } from '../normalizers';
import { parseCSV } from '../parsers';
import { RevenueImportSchema } from '../schemas';
import { seedRevenue } from '../seeders';
import { validateRevenuesData } from '../validators';

export async function importRevenue(revenuePath: string) {
  const revenueImport = parseCSV(revenuePath, RevenueImportSchema);
  const normalizedRevenue = normalizeRevenue(revenueImport);
  const validatedRevenue = validateRevenuesData(normalizedRevenue);

  return await seedRevenue(validatedRevenue);
}
