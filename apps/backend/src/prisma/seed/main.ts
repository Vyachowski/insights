import { checkFilesExistence } from './checkers';
import { checkDatabaseConnection } from './checkers';
import { formatImportResult } from './helpers';
import {
  importCalls,
  importCities,
  importExpenses,
  importRevenue,
  importSiteMetrics,
  importSites,
  importUsers,
} from './orchestrators';

type Seed = (
  paths: {
    cities: string;
    sites: string;
    calls: string;
    revenue: string;
    siteMetrics: string;
    expenses: string;
  },
  withCreation?: boolean,
) => Promise<void>;

const seed: Seed = async (paths, isRefetchDataNeeded = false) => {
  const pathsList = Object.values(paths);

  await checkDatabaseConnection();
  console.log('✅ Database connection succesfully established.');

  await checkFilesExistence(pathsList);
  console.log('✅ Required files exists.');

  const usersResult = await importUsers();
  console.log(formatImportResult('Users', usersResult));

  const citiesResult = await importCities(paths.cities);
  console.log(formatImportResult('Cities', citiesResult));

  const sitesResult = await importSites(paths.sites);
  console.log(formatImportResult('Sites', sitesResult));

  const callsResult = await importCalls(paths.calls, sitesResult.data);
  console.log(formatImportResult('Calls', callsResult));

  const revenueResult = await importRevenue(paths.revenue);
  console.log(formatImportResult('Revenue', revenueResult));

  const expensesResult = await importExpenses(paths.expenses);
  console.log(formatImportResult('Expenses', expensesResult));

  const siteMetricsResult = await importSiteMetrics(
    paths.siteMetrics,
    isRefetchDataNeeded,
  );
  console.log(formatImportResult('Site metrics', siteMetricsResult));
};

export default seed;
