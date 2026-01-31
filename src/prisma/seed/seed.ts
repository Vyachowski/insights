import path from "path";
import appRootPath from "app-root-path";
import { parseCSV, normalizeCallData } from "./helpers";
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

  console.log('Импортируем данные в базу...')

  await prisma.city.createMany({
      data: citiesData,
      skipDuplicates: true,
    });
    console.log('Cities seeded');

    await prisma.call.createMany({
      data: callsData,
      skipDuplicates: true,
    });
    console.log('Calls seeded');
  
    await prisma.revenue.createMany({
      data: revenueData,
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
