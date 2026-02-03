import { createCitiesCSV } from "./scripts/data/create-cities";
import { createCallsCSV } from "./scripts/data/create-calls";
import { createSitesCSV } from "./scripts/data/create-sites";
import { createSiteMetricsCSV } from "./scripts/data/create-site-metrics";
import { createRevenueCSV } from "./scripts/data/create-revenue";
import { createExpensesCSV } from "./scripts/data/create-expenses";

async function app() {
  await createCitiesCSV();
  await createSitesCSV();
  await createCallsCSV();
  await createSiteMetricsCSV();
  await createRevenueCSV();
  await createExpensesCSV();
}

await app();
