import path from 'path';
import appRootPath from 'app-root-path';

import { prisma } from '../../lib/prisma';
import { checkDatabaseConnection, checkFilesExistence } from './utils/checkers';
import { seedCalls, seedCities, seedExpenses, seedRevenue, seedSiteMetrics, seedSites } from './utils/seeders';

const main = async (logger = console.log) => {
  // SECTION: Paths
  const paths = {
    cities: path.resolve(appRootPath.path, 'data/cities/cities.csv'),
    sites: path.resolve(appRootPath.path, 'data/sites/sites.csv'),
    calls: path.resolve(appRootPath.path, 'data/calls/calls.csv'),
    revenue: path.resolve(appRootPath.path, 'data/revenue/revenue.csv'),
    siteMetrics: path.resolve(appRootPath.path, 'data/site-metrics/site-metrics.csv'),
  }

  // SECTION: Checks
  logger('⏳ Check database connection...');

  await checkDatabaseConnection()
  logger('✅ Database connection succesfully established.');

  await checkFilesExistence(Object.values(paths))
  logger('✅ Required files exists.');

  // SECTION: Seeding
  logger('⏳ Seeding data...');

  await seedCities(paths.cities)
  logger('✅ All cities succesfully imported to database.');
  await seedSites(paths.sites)
  logger('✅ All sites succesfully imported to database.');
  await seedCalls(paths.calls)
  logger('✅ All calls succesfully imported to database.');
  await seedRevenue(paths.revenue)
  logger('✅ All revenue succesfully imported to database.');
  await seedSiteMetrics(paths.siteMetrics)
  logger('✅ All site metrics succesfully imported to database.');
  await seedExpenses('')
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