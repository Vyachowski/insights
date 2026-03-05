import path, { join } from 'path';
import seed from './modules/main';

export function resolveSharedPaths(filePrefix: string) {
  const folderPath = join('./', 'input');

  return Object.freeze({
    folderPath,
    filePaths: {
      cities: path.resolve(folderPath, 'cities.csv'),
      sites: path.resolve(folderPath, 'sites.csv'),
      calls: path.resolve(folderPath, `${filePrefix}calls.csv`),
      revenue: path.resolve(folderPath, `${filePrefix}revenue.csv`),
      siteMetricsDir: path.resolve(folderPath, 'site-metrics'),
      siteMetrics: path.resolve(folderPath, `${filePrefix}site-metrics.csv`),
      expenses: path.resolve(folderPath, `${filePrefix}expenses.csv`),
    },
  });
}

// TODO: Move to shared config
const IMPORT_START_DATE = '2021-05-01';
const IMPORT_END_DATE = '2026-02-15';
const FILE_PREFIX = `${IMPORT_START_DATE}_${IMPORT_END_DATE}_`;

const { filePaths: paths } = resolveSharedPaths(FILE_PREFIX);

seed(paths).catch((e) => {
  console.error(e);
  process.exit(1);
});
