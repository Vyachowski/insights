import { fromSrcRoot } from '@/lib';
import path, { join } from 'path';

export const IMPORT_START_DATE = '2021-05-01';
export const IMPORT_END_DATE = '2025-12-31';
export const FILE_PREFIX = `${IMPORT_START_DATE}_${IMPORT_END_DATE}_`;
export const ALT_FILE_PREFIX = `${IMPORT_START_DATE}_2026-02-15_`;
export const FOLDER_PATH = fromSrcRoot('prisma/seed/data');
export const RAW_FOLDER_PATH = join(FOLDER_PATH, 'raw');
export const PREPARED_FOLDER_PATH = join(FOLDER_PATH, 'prepared');

export const RAW_FILES_PATHS = Object.freeze({
  cities: path.resolve(RAW_FOLDER_PATH, 'cities.csv'),
  sites: path.resolve(RAW_FOLDER_PATH, 'sites.csv'),
  calls: path.resolve(RAW_FOLDER_PATH, `${FILE_PREFIX}calls.csv`),
  revenue: path.resolve(RAW_FOLDER_PATH, `${FILE_PREFIX}revenue.csv`),
  siteMetricsDir: path.resolve(RAW_FOLDER_PATH, 'site-metrics'),
  siteMetrics: path.resolve(RAW_FOLDER_PATH, `${FILE_PREFIX}site-metrics.csv`),
  // expenses: path.resolve(folderPath, `${filePrefix}expenses.csv`),
  expenses: path.resolve(RAW_FOLDER_PATH, `${FILE_PREFIX}expenses.csv`),
});

export const PREPARED_FILES_PATHS = Object.freeze({
  cities: path.resolve(PREPARED_FOLDER_PATH, 'cities.csv'),
  sites: path.resolve(PREPARED_FOLDER_PATH, 'sites.csv'),
  calls: path.resolve(PREPARED_FOLDER_PATH, `${FILE_PREFIX}calls.csv`),
  revenue: path.resolve(PREPARED_FOLDER_PATH, `${FILE_PREFIX}revenue.csv`),
  siteMetricsDir: path.resolve(PREPARED_FOLDER_PATH, 'site-metrics'),
  siteMetrics: path.resolve(
    PREPARED_FOLDER_PATH,
    `${FILE_PREFIX}site-metrics.csv`,
  ),
  // expenses: path.resolve(folderPath, `${filePrefix}expenses.csv`),
  expenses: path.resolve(PREPARED_FOLDER_PATH, `${FILE_PREFIX}expenses.csv`),
});
