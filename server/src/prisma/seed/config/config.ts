import { join } from 'path';

const rootPath = process.cwd();
const importFolderPath = join(rootPath, '..', 'shared', 'seed-data');

const IMPORT_START_DATE = '2021-05-01';
const IMPORT_END_DATE = '2025-12-31';
const FILE_SEPARATOR = '_';

const FILE_PREFIX = `${IMPORT_START_DATE}${FILE_SEPARATOR}${IMPORT_END_DATE}${FILE_SEPARATOR}`;

const BATCH_SIZE = 'month';
const paths = {
  cities: join(importFolderPath, `${FILE_PREFIX}cities.csv`),
  sites: join(importFolderPath, `${FILE_PREFIX}sites.csv`),
  calls: join(importFolderPath, `${FILE_PREFIX}calls.csv`),
  revenue: join(importFolderPath, `${FILE_PREFIX}revenue.csv`),
  siteMetrics: join(importFolderPath, `${FILE_PREFIX}site-metrics.csv`),
  expenses: join(importFolderPath, `${FILE_PREFIX}expenses.csv`),
};

export default {
  IMPORT_START_DATE,
  IMPORT_END_DATE,
  BATCH_SIZE,
  paths,
};
