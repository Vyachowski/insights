import path from "path";
import fs from "fs/promises";

import config from "./config/config";
import { createCitiesCSV } from "./scripts/data/create-cities";
// import { createCallsCSV } from "./scripts/data/create-calls";
import { createSitesCSV } from "./scripts/data/create-sites";
// import { createSiteMetricsCSV } from "./scripts/data/create-site-metrics";
// import { createRevenueCSV } from "./scripts/data/create-revenue";
// import { createExpensesCSV } from "./scripts/data/create-expenses";

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
  logger(cities.data);
  const sites = await createSitesCSV();
  logger(sites.data);
  // await createCallsCSV(sites);
  // await createSiteMetricsCSV(sites.data);
  // await createRevenueCSV();
  // await createExpensesCSV();
}

await app();
