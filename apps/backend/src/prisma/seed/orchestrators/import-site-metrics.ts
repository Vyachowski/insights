import { normalizeSiteMetrics } from '../normalizers';
import { parseCSV } from '../parsers';
import { SiteMetricsImportSchema } from '../schemas';
import { seedSiteMetrics } from '../seeders';
import { validateSiteMetricsData } from '../validators';

export async function importSiteMetrics(
  siteMetricsPath: string,
  isRefetchDataNeeded = false,
) {
  let siteMetricsData = parseCSV(siteMetricsPath, SiteMetricsImportSchema);

  if (isRefetchDataNeeded) {
    // TODO: make data fetching
  } else {
    siteMetricsData = parseCSV(siteMetricsPath, SiteMetricsImportSchema);
  }
  const normalizedSiteMetrics = normalizeSiteMetrics(siteMetricsData);
  const validatedSiteMetrics = validateSiteMetricsData(normalizedSiteMetrics);

  return await seedSiteMetrics(validatedSiteMetrics);
}
