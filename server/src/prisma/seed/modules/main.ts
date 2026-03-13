import {
  checkDatabaseConnection,
  checkFilesExistence,
} from '../checkers/checkers';

import {
  seedCalls,
  seedCities,
  seedRevenue,
  seedSites,
  seedUsers,
  seedExpenses,
  seedSiteMetrics,
} from '../seeders';

type Seed = (
  paths: {
    cities: string;
    sites: string;
    calls: string;
    revenue: string;
    siteMetrics: string;
    expenses: string;
  },
  rawFilePaths?: {
    cities?: string;
    sites?: string;
    calls?: string;
    revenue?: string;
    siteMetrics?: string;
    expenses?: string;
  },
  withCreation?: boolean,
) => Promise<void>;

const createData = (
  paths: {
    cities: string;
    sites: string;
    calls: string;
    revenue: string;
    siteMetrics: string;
    expenses: string;
  },
  fetchMetrics = true,
) => {
  createExpenses();

  if (fetchMetrics) {
    // createSiteMetricsCSV();
  } else {
    // copyMetricsFiles();
  }
};

const seed: Seed = async (paths, rawPaths, withCreation = false) => {
  const { cities, sites, calls, revenue, expenses, siteMetrics } = paths;
  const pathsList = Object.values(paths);

  if (withCreation) {
    createData(paths);
  }

  // SECTION: Checks
  console.log('⏳ Check database connection...');

  await checkDatabaseConnection();
  console.log('✅ Database connection succesfully established.');

  await checkFilesExistence(pathsList);
  console.log('✅ Required files exists.');

  // SECTION: Seeding
  console.log('⏳ Seeding data...');

  await seedUsers();
  console.log('✅ Admin and User succesfully created.');
  await seedCities(cities);
  console.log('✅ All cities succesfully imported to database.');
  await seedSites(sites);
  console.log('✅ All sites succesfully imported to database.');
  // await seedCalls(calls);
  // logger('✅ All calls succesfully imported to database.');
  // await seedRevenue(revenue);
  // logger('✅ All revenue succesfully imported to database.');
  // await seedExpenses(expenses);
  // logger('✅ All expenses succesfully imported to database.');
  // await seedSiteMetrics(siteMetrics);
  // logger('✅ All site metrics succesfully imported to database.');
};

export default seed;
