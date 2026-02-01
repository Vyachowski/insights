import path from "path";
import appRootPath from "app-root-path";
import { parseCSV, normalizeCallData, validateCitiesData, validateSitesData, validateCallsData, validateRevenuesData, validateSiteMetricsData } from "./helpers";
import { prisma } from '../../lib/prisma';
import { checkDatabaseConnection } from "./helpers/checkers";

const main = async () => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.error('\n🛑 Aborting: Unable to connect to database');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));

  const citiesPath = path.resolve(appRootPath.path, 'data/cities/cities.csv');
  const sitesPath = path.resolve(appRootPath.path, 'data/sites/sites.csv');
  const callsPath = path.resolve(appRootPath.path, 'data/calls/calls.csv');
  const revenuePath = path.resolve(appRootPath.path, 'data/revenue/revenue.csv');
  const siteMetricsPath = path.resolve(appRootPath.path, 'data/site-metrics/site-metrics.csv');

  console.log('Reading export files...')
  const citiesData = parseCSV(citiesPath);
  const sitesData = parseCSV(sitesPath);
  const callsData = parseCSV(callsPath);
  const revenueData = parseCSV(revenuePath);
  const siteMetricsData = parseCSV(siteMetricsPath);

  console.log('Validating cities data...')
  const validatedCitiesData = validateCitiesData(citiesData);

  console.log('Loading cities with explicit IDs from CSV...')
  for (const city of validatedCitiesData) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city,
    });
  }
  console.log('✓ Cities seeded');

  console.log('Loading cities from database for mapping...')
  const importedCities = await prisma.city.findMany();

  console.log('Normalizing calls data...')
  const normalizedCalls = normalizeCallData(callsData, importedCities);

  console.log('Validating data for import...')
  const validatedSitesData = validateSitesData(sitesData);
  const validatedCallsData = validateCallsData(normalizedCalls);
  const validatedRevenueData = validateRevenuesData(revenueData);
  const validatedMetricsData = validateSiteMetricsData(siteMetricsData);

  console.log('Importing remaining data to database...')
  await prisma.site.createMany({
    data: validatedSitesData,
    skipDuplicates: true,
  });
  console.log('✓ Sites seeded');

  await prisma.call.createMany({
    data: validatedCallsData,
    skipDuplicates: true,
  });
  console.log('✓ Calls seeded');

  await prisma.revenue.createMany({
    data: validatedRevenueData,
    skipDuplicates: true,
  });
  console.log('✓ Revenue seeded');

  console.log('Importing site metrics...');
  const BATCH_SIZE = 1000;
  const totalMetrics = validatedMetricsData.length;
  let importedCount = 0;

  for (let i = 0; i < totalMetrics; i += BATCH_SIZE) {
    const batch = validatedMetricsData.slice(i, i + BATCH_SIZE);

    await prisma.siteMetric.createMany({
      data: batch,
      skipDuplicates: true,
    });

    importedCount += batch.length;
    const progress = ((importedCount / totalMetrics) * 100).toFixed(1);
    console.log(`  Progress: ${importedCount}/${totalMetrics} (${progress}%)`);
  }
  console.log('✓ Site metrics seeded');
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