import type { RunParams } from "./types";

import { createCallsCSV } from "./creators/calls/main";
import { createCitiesCSV } from "./creators/create-cities";
import { createRevenueCSV } from "./creators/create-revenue";
import { createSitesCSV } from "./creators/create-sites";
import { createExpensesCSV } from "./creators/expenses/main";
import { createSiteMetricsCSV } from "./creators/site-metrics/main";

export default async function run({ inputPaths, outputPaths, outputDir, startDate, endDate, options }: RunParams) {
  const {
    logger = console.log,
    breaker = "\n\n=======================\n",
    cleanerFunc
  } = options;

  await cleanerFunc(outputDir);

  const cities = await createCitiesCSV({ inputPath: inputPaths.cities, outputPath: outputPaths.cities });
  logger(cities.message, breaker);

  const sites = await createSitesCSV ({ inputPath: inputPaths.sites, outputPath: outputPaths.sites });
  logger(sites.message, breaker);

  const calls = await createCallsCSV({ inputPath: inputPaths.calls, outputPath: outputPaths.calls, cities: cities.data });
  logger(calls.message, breaker);

  const metrics = await createSiteMetricsCSV({ inputPath: inputPaths.siteMetrics, outputPath: outputPaths.siteMetrics, sites: sites.data, options: { source: "backup" }});
  logger(metrics.message, breaker);

  const revenue = await createRevenueCSV({ inputPath: inputPaths.revenue, outputPath: outputPaths.revenue });
  logger(revenue.message, breaker);

  const expenses = await createExpensesCSV({ outputPath: outputPaths.expenses, cities: cities.data, startDate, endDate });
  logger(expenses.message, breaker);
}

// NOTE: Next type call signature
// const metrics = await createSiteMetricsCSV(sites.data, {
//   source: "api",
//   startDate: new Date(config.IMPORT_START_DATE),
//   endDate: new Date(config.IMPORT_END_DATE),
//   years: [2022],
// });
