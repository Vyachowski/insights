import path from 'path';
import appRootPath from 'app-root-path';

import { prisma } from '../../lib/prisma';
import { checkDatabaseConnection } from "./helpers/checkers";
import { checkFilesExistence } from './utils/checkFilesExistence';

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
  await checkDatabaseConnection()
  logger('✅ Database connection succesfully established.');

  await checkFilesExistence(Object.values(paths))
  logger('✅ Required files exists.');

  // SECTION: Seeding
  seedCities()
  logger('✅ All cities succesfully imported to database.');
  seedSites()
  logger('✅ All sites succesfully imported to database.');
  seedCalls()
  logger('✅ All calls succesfully imported to database.');
  seedRevenue()
  logger('✅ All revenue succesfully imported to database.');
  seedSiteMetrics()
  logger('✅ All site metrics succesfully imported to database.');
  seedExpenses()
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