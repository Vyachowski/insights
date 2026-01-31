import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

const citiesPath = path.resolve(appRootPath.path, 'data', 'cities', 'cities.csv');
const callsPath = path.resolve(appRootPath.path, 'data', 'calls', 'calls.csv');

const durationToSeconds = (str: string): number | null => {
  if (!str) return null;
  const [minutes, seconds] = str.split(':').map(Number);
  if (!minutes || isNaN(minutes) || !seconds || isNaN(seconds)) return null;
  return minutes * 60 + seconds;
};

const parseCityName = (project: string) => project.replaceAll('Дезинсекция – ', '').replaceAll(' – Дезинсекция', '')
const parseCallDate = (str: string) => {
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) process.exit(1);

  const [day, month, year] = datePart.split('.').map(Number);

  if (!year || !month || !day) process.exit(1);

  const [hour, minute] = timePart.split(':').map(Number);

  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day, hour, minute);
};

// ---------------- PARSE CSV ----------------
const parseCSV = (filepath: string, delimeter = ',') => {
  const content = fs.readFileSync(filepath, 'utf-8');

  const lines = content.split('\n').filter(Boolean);
  const headers = lines.shift()!.split(delimeter).map(h => h.trim());

  return lines.map(line => {
    const values = line.split(delimeter).map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
};

// ---------------- VALIDATE CSV -------------
// ---------------- NORMALIZE ----------------
const normalizeCityData = (data: { [k: string]: string | undefined }[]) => {
  return data.map((row: any) => ({
    name: row.name,
    alt_names: row.alt_names && row.alt_names !== 'null' && row.alt_names !== '' ? JSON.parse(row.alt_names) : null,
    url: row.url,
    display_order: Number(row.display_order),
    revenue_share: row.revenue_share ? new Prisma.Decimal(row.revenue_share) : null,
    priority: row.priority,
  }));
};

const normalizeCallData = (data: { [k: string]: string | undefined }[]) => {
  return data.map((row: any) => ({
    date_time: parseCallDate(row['Дата']),
    caller_number: row['Кто звонил'] || null,
    region: row['Откуда'] || null,
    class: row['Класс'] || null,
    project: row['Проект'],
    number_name: row['Куда звонил'],
    call_order: Number(row['№']),
    duration_in_sec: durationToSeconds(row['Запись']) || 0,
    comment: row['Комментарий'] || null,
    redirect_number: row['Вызов завершен'],
  })).filter(row => row.date_time !== null && row.caller_number !== null);
};

// Загружаем JSON с сообщениями
const revenueMessagesPath = path.resolve(appRootPath.path, 'data', 'revenueMessage.json');
const revenueMessagesRaw = fs.readFileSync(revenueMessagesPath, 'utf-8');
const revenueMessages: {
  date: string;
  from: string;
  text: string;
  numbers: number | number[];
}[] = JSON.parse(revenueMessagesRaw);

// Нормализация
const normalizedRevenue = revenueMessages
  .map(msg => {
    let amount = 0;

    if (Array.isArray(msg.numbers)) {
      amount = msg.numbers.reduce((sum, n) => sum + n, 0);
    } else if (typeof msg.numbers === 'number') {
      amount = msg.numbers;
    }

    // Игнорируем суммы <1000 (если нужно)
    if (amount < 1000) return null;

    return {
      date: new Date(msg.date),
      amount: new Prisma.Decimal(amount),
      active_cities: 19,
    };
  })
  .filter(Boolean) as {
    date: Date;
    amount: Prisma.Decimal;
    active_cities: number;
  }[];

// ---------------- MAIN ----------------
const main = async () => {
  // --- Cities ---
  const cityRows = parseCSV(citiesPath, ';');
  const citiesData = normalizeCityData(cityRows);

  await prisma.city.createMany({
    data: citiesData,
    skipDuplicates: true,
  });
  console.log('Cities seeded');

  // --- Prepare city lookup ---
  const cityList = await prisma.city.findMany({ select: { id: true, name: true, alt_names: true } });
  const cityMap: Record<string, number> = {};

  for (const c of cityList) {
    cityMap[c.name.toLowerCase()] = c.id;

    if (c.alt_names) {
      let altNames: string[] = [];
      try {
        altNames = Array.isArray(c.alt_names) ? c.alt_names : JSON.parse(c.alt_names as string);
      } catch (e) {
        console.warn(`Failed to parse alt_names for city ${c.name}`, e);
      }

      if (Array.isArray(altNames)) {
        for (const alt of altNames) {
          if (typeof alt === 'string') {
            cityMap[alt.toLowerCase()] = c.id;
          }
        }
      }
    }
  }

  // --- Calls ---
  const callRows = parseCSV(callsPath);
  const callsData = normalizeCallData(callRows).map(call => {
    const cityName = parseCityName(call.project).toLowerCase();
    const city_id = cityMap[cityName];
    if (!city_id) {
      console.warn(`City not found for call: ${call.project} (parsed as: ${cityName})`);

      return null;
    }
    return { ...call, city_id };
  }).filter(Boolean);

  await prisma.call.createMany({
    data: callsData as any[],
    skipDuplicates: true,
  });
  console.log('Calls seeded');

  await prisma.revenue.createMany({
    data: normalizedRevenue,
    skipDuplicates: true,
  });

  console.log('Revenue seeded.');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
