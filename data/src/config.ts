import appRootPath from "app-root-path";
import path from "path";

const inputFolderPath = path.resolve(appRootPath.path, "input");
const outputFolderPath = path.resolve(appRootPath.path, "output");

const IMPORT_START_DATE = "2021-05-01";
const IMPORT_END_DATE = "2025-12-31";
const FILE_SEPARATOR = "_";

const FILE_PREFIX = `${IMPORT_START_DATE}${FILE_SEPARATOR}${IMPORT_END_DATE}${FILE_SEPARATOR}`;

const BATCH_SIZE = "month";
const paths = {
  input: {
    cities: path.resolve(inputFolderPath, `${FILE_PREFIX}cities.csv`),
    sites: path.resolve(inputFolderPath, `${FILE_PREFIX}sites.csv`),
    calls: path.resolve(inputFolderPath, `${FILE_PREFIX}calls.csv`),
    revenue: path.resolve(inputFolderPath, `${FILE_PREFIX}revenue.json`),
    revenueFolder: path.resolve(inputFolderPath, `${FILE_PREFIX}revenue-tg`),
  },
  output: {
    cities: path.resolve(outputFolderPath, `${FILE_PREFIX}cities.csv`),
    sites: path.resolve(outputFolderPath, `${FILE_PREFIX}sites.csv`),
    calls: path.resolve(outputFolderPath, `${FILE_PREFIX}calls.csv`),
    revenue: path.resolve(outputFolderPath, `${FILE_PREFIX}revenue.csv`),
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
};
