import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { prisma } from '../lib/prisma';
import { Prisma } from '../generated/prisma/client';

const citiesPath = path.resolve(appRootPath.path, 'data', 'cities', 'cities.csv')

const parseCSV = (filepath: string) => {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(Boolean);

  const headers = lines.shift()!
    .split(';')
    .map(h => h.trim());

  return lines.map(line => {
    const values = line.split(';').map(v => v.trim());

    return Object.fromEntries(
      headers.map((h, i) => [h, values[i]])
    );
  });
};

const normalizeData = (data: { [k: string]: string | undefined; }[]) => {
    return data.map((row: any) => ({
      name: row.name,
      alt_names:
        row.alt_names && row.alt_names !== 'null' && row.alt_names !== ''
            ? JSON.parse(row.alt_names)
            : null,
      url: row.url,
      display_order: Number(row.display_order),
      revenue_share: row.revenue_share
        ? new Prisma.Decimal(row.revenue_share)
        : null,
      priority: row.priority,
    }))
}

console.log(normalizeData(parseCSV(citiesPath)))

const main = async () => {
  const rows = parseCSV(citiesPath);
  const data = normalizeData(rows);

  await prisma.city.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('Cities seeded');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })