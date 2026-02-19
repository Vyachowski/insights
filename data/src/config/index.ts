import appRootPath from "app-root-path";
import path, { join } from "path";

const inputFolderPath = join(appRootPath.path, "data", "input");
const outputFolderPath = join(appRootPath.path, "shared", "seed-data");

const IMPORT_START_DATE = "2021-05-01";
const IMPORT_END_DATE = "2026-02-15";
const FILE_SEPARATOR = "_";

const FILE_PREFIX = `${IMPORT_START_DATE}${FILE_SEPARATOR}${IMPORT_END_DATE}${FILE_SEPARATOR}`;

// FIXME: Delete this when it will be unnecessary
// const oldSiteMetricsBackupPath = `archive/${FILE_PREFIX}site-metrics.csv`;

const BATCH_SIZE = "month";
const paths = {
  input: {
    cities: path.resolve(inputFolderPath, 'cities.csv'),
    sites: path.resolve(inputFolderPath, 'sites.csv'),
    calls: path.resolve(inputFolderPath, `${FILE_PREFIX}calls.csv`),
    revenue: path.resolve(inputFolderPath, `${FILE_PREFIX}revenue.json`),
    revenueFolder: path.resolve(inputFolderPath, `${FILE_PREFIX}revenue-tg`),
    siteMetricsBackup: path.resolve(
      outputFolderPath,
      `archive/2021-05-01_2025-12-31_site-metrics.csv`,
    ),
  },
  output: {
    cities: path.resolve(outputFolderPath, 'cities.csv'),
    sites: path.resolve(outputFolderPath, 'sites.csv'),
    calls: path.resolve(outputFolderPath, `${FILE_PREFIX}calls.csv`),
    revenue: path.resolve(outputFolderPath, `${FILE_PREFIX}revenue.csv`),
    siteMetricsDir: path.resolve(outputFolderPath, "site-metrics"),
    siteMetrics: path.resolve(
      outputFolderPath,
      `${FILE_PREFIX}site-metrics.csv`,
    ),
    expenses: path.resolve(outputFolderPath, `${FILE_PREFIX}expenses.csv`),
  },
};

export default {
  IMPORT_START_DATE,
  IMPORT_END_DATE,
  BATCH_SIZE,
  paths,
  outputFolderPath,
};
