import path from "path";
import fs from "fs/promises";

import config from "./config";
import { createCitiesCSV } from "./creators/create-cities";

import { createSitesCSV } from "./creators/create-sites";
import { createCallsCSV } from "./creators/calls/main";
import { createSiteMetricsCSV } from "./creators/site-metrics/main";
import { createRevenueCSV } from "./creators/create-revenue";
import { createExpensesCSV } from "./creators/expenses/main";

const breaker = "\n\n=======================\n";

async function removeFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => fs.rm(path.join(dir, entry.name))),
  );
}

async function app(logger = console.log) {
  const outputFolderPath = config.outputFolderPath;
  await removeFiles(outputFolderPath);

  const cities = await createCitiesCSV();
  logger(cities.message, breaker);

  const sites = await createSitesCSV();
  logger(sites.message, breaker);

  const calls = await createCallsCSV(cities.data);
  logger(calls.message, breaker);

  // const metrics = await createSiteMetricsCSV(sites.data, { source: "backup" });
  const metrics = await createSiteMetricsCSV(sites.data, {
    source: "api",
    startDate: new Date(config.IMPORT_START_DATE),
    endDate: new Date(config.IMPORT_END_DATE),
    years: [2025],
  });
  logger(metrics.message, breaker);

  const revenue = await createRevenueCSV();
  logger(revenue.message, breaker);

  const expenses = await createExpensesCSV();
  logger(expenses.message, breaker);
}

await app();
