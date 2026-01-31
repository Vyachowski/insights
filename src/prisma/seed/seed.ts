import path from "path";
import appRootPath from "app-root-path";
import { parseCSV, normalizeCallData, validateCitiesData, validateSitesData, validateCallsData, validateRevenuesData } from "./helpers";
import { prisma } from '../../lib/prisma';

const main = async () => {
  const citiesPath = path.resolve(appRootPath.path, 'data/cities/cities.csv');
  const sitesPath = path.resolve(appRootPath.path, 'data/sites/sites.csv');
  const callsPath = path.resolve(appRootPath.path, 'data/calls/calls.csv');
  const revenuePath = path.resolve(appRootPath.path, 'data/revenue/revenue.csv');

  console.log('Читаем файлы экспорта...')
  const citiesData = parseCSV(citiesPath);
  const sitesData = parseCSV(sitesPath);
  const callsData = parseCSV(callsPath);
  const revenueData = parseCSV(revenuePath);

  console.log('Нормализуем данные для импорта...')
  const normalizedCalls = normalizeCallData(callsData, citiesData);

  console.log('Проверяем данные для импорта...')
  const validatedCitiesData = validateCitiesData(citiesData);
  const validatedSitesData = validateSitesData(sitesData);
  const validatedCallsData = validateCallsData(normalizedCalls);
  const validatedRevenueData = validateRevenuesData(revenueData);
  
  console.log('Импортируем данные в базу...')
  await prisma.city.createMany({
    data: validatedCitiesData,
    skipDuplicates: true,
  });
  console.log('Cities seeded');

  await prisma.site.createMany({
    data: validatedSitesData,
    skipDuplicates: true,
  });
  console.log('Sites seeded');

  await prisma.call.createMany({
    data: validatedCallsData,
    skipDuplicates: true,
  });

  console.log('Calls seeded');

  await prisma.revenue.createMany({
    data: validatedRevenueData,
    skipDuplicates: true,
  });

  console.log('Revenue seeded.');
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
