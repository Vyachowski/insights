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

  console.log('Валидируем данные городов...')
  const validatedCitiesData = validateCitiesData(citiesData);

  console.log('Загружаем города с явными ID из CSV...')
  for (const city of validatedCitiesData) {
    await prisma.city.upsert({
        where: { id: city.id },
        update: city,
        create: city,
    });
  }
  console.log('Cities seeded');

  console.log('Загружаем города из базы для маппинга...')
  const importedCities = await prisma.city.findMany();

  console.log('Нормализуем данные звонков...')
  const normalizedCalls = normalizeCallData(callsData, importedCities);

  console.log('Проверяем данные для импорта...')
  const validatedSitesData = validateSitesData(sitesData);
  const validatedCallsData = validateCallsData(normalizedCalls);
  const validatedRevenueData = validateRevenuesData(revenueData);
  
  console.log('Импортируем остальные данные в базу...')
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
