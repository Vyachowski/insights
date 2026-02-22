import { checkDatabaseConnection, checkFilesExistence } from './checkers';
import {
  seedCalls,
  seedCities,
  seedRevenue,
  seedSites,
  seedUsers,
  seedExpenses,
  seedSiteMetrics,
} from './seeders';

type Seed = (
  paths: {
    cities: string;
    sites: string;
    calls: string;
    revenue: string;
    siteMetrics: string;
    expenses: string;
  },
  options?: {
    logger: typeof console.log;
  },
) => Promise<void>;

const seed: Seed = async (paths, { logger } = { logger: console.log }) => {
  const { cities, sites, calls, revenue, expenses, siteMetrics } = paths;
  const pathsList = Object.values(paths);

  // SECTION: Checks
  logger('⏳ Check database connection...');

  await checkDatabaseConnection();
  logger('✅ Database connection succesfully established.');

  await checkFilesExistence(pathsList);
  logger('✅ Required files exists.');

  // SECTION: Seeding
  logger('⏳ Seeding data...');

  await seedUsers();
  logger('✅ Admin and User succesfully created.');
  await seedCities(cities);
  logger('✅ All cities succesfully imported to database.');
  await seedSites(sites);
  logger('✅ All sites succesfully imported to database.');
  await seedCalls(calls);
  logger('✅ All calls succesfully imported to database.');
  await seedRevenue(revenue);
  logger('✅ All revenue succesfully imported to database.');
  await seedExpenses(expenses);
  logger('✅ All expenses succesfully imported to database.');
  await seedSiteMetrics(siteMetrics);
  logger('✅ All site metrics succesfully imported to database.');
};

export default seed;
