import { checkFilesExistence } from './checkers';
import { checkDatabaseConnection } from './checkers';
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
  // SECTION: Checks
  console.log('⏳ Check database connection...');

  await checkDatabaseConnection();
  console.log('✅ Database connection succesfully established.');

  await checkFilesExistence(pathsList);
  console.log('✅ Required files exists.');

  // SECTION: Seeding
  console.log('⏳ Seeding data...');

  await importUsers();
  console.log('✅ Admin and User succesfully created.');
  const cities = await importCities(paths.cities);
  console.log('✅ All cities succesfully imported to database.');
  await importSites(paths.sites);
  console.log('✅ All sites succesfully imported to database.');
  await importCalls(paths.calls, cities);
  console.log('✅ All calls succesfully imported to database.');
  await importRevenue(paths.revenue);
  console.log('✅ All revenue succesfully imported to database.');
  await importExpenses(paths.expenses);
  console.log('✅ All expenses succesfully imported to database.');
  await importSiteMetrics(paths.siteMetrics, isRefetchDataNeeded);
  console.log('✅ All site metrics succesfully imported to database.');
};

export default seed;
