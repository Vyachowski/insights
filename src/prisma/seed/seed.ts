import config from '../../config';
import { prisma } from '../../lib/prisma';
import { checkDatabaseConnection, checkFilesExistence } from './utils/checkers';
import { seedCalls, seedCities, seedExpenses, seedRevenue, seedSiteMetrics, seedSites } from './utils/seeders';

const main = async (logger = console.log) => {
  const {
    cities,
    sites,
    calls,
    revenue,
    siteMetrics,
    expenses
  } = config.dataFilePaths.import

  // SECTION: Checks
  logger('⏳ Check database connection...');

  await checkDatabaseConnection()
  logger('✅ Database connection succesfully established.');

  await checkFilesExistence(Object.values(config.dataFilePaths.import))
  logger('✅ Required files exists.');

  // SECTION: Seeding
  logger('⏳ Seeding data...');

  await seedCities(cities)
  logger('✅ All cities succesfully imported to database.');
  await seedSites(sites)
  logger('✅ All sites succesfully imported to database.');
  await seedCalls(calls)
  logger('✅ All calls succesfully imported to database.');
  await seedRevenue(revenue)
  logger('✅ All revenue succesfully imported to database.');
  await seedSiteMetrics(siteMetrics)
  logger('✅ All site metrics succesfully imported to database.');
  await seedExpenses(expenses)
  logger('✅ All expenses succesfully imported to database.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });