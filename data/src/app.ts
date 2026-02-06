import path from "path";
import fs from "fs/promises";

import config from "./config/config";
import { createCitiesCSV } from "./creators/create-cities";

import { createSitesCSV } from "./creators/create-sites";
import { createCallsCSV } from "./creators/calls";
import { createSiteMetricsCSV } from "./creators/site-metrics/index";
import { createRevenueCSV } from "./creators/create-revenue";
import { createExpensesCSV } from "./creators/create-expenses";

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

  // TODO: RESUME HERE!!!
  await createSiteMetricsCSV(sites.data);
  await createRevenueCSV();
  await createExpensesCSV();
}

await app();
