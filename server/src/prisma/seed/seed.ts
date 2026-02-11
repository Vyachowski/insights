import config from './config/config';
import { checkDatabaseConnection, checkFilesExistence } from './utils/checkers';
import {
  seedCalls,
  seedCallsImport,
  seedCities,
  seedExpenses,
  seedRevenue,
  seedSiteMetrics,
  seedSites,
  seedUsers,
} from './utils/seeders';

const paths = config.paths;

const main = async (
  paths: {
    cities: string;
    sites: string;
    calls: string;
    revenue: string;
    siteMetrics: string;
    expenses: string;
  },
  options = { logger: console.log },
) => {
  const { cities, sites, calls, revenue, siteMetrics, expenses } = paths;
  const logger = options.logger;

  // SECTION: Checks
  logger('⏳ Check database connection...');

  await checkDatabaseConnection();
  logger('✅ Database connection succesfully established.');

  await checkFilesExistence(Object.values(config.paths));
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
  // await seedRevenue(revenue);
  // logger('✅ All revenue succesfully imported to database.');
  // await seedSiteMetrics(siteMetrics);
  // logger('✅ All site metrics succesfully imported to database.');
  // await seedExpenses(expenses);
  // logger('✅ All expenses succesfully imported to database.');
};

main(paths).catch((e) => {
  console.error(e);
  process.exit(1);
});
