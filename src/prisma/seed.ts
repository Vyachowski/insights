import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { prisma } from '../lib/prisma';
import { Prisma } from '../generated/prisma/client';

const citiesPath = path.resolve(appRootPath.path, 'data', 'cities', 'cities.csv');
const callsPath = path.resolve(appRootPath.path, 'data', 'calls', 'calls.csv');

const durationToSeconds = (str: string): number | null => {
  if (!str) return null;
  const [minutes, seconds] = str.split(':').map(Number);
  if (!minutes || isNaN(minutes) || !seconds || isNaN(seconds)) return null;
  return minutes * 60 + seconds;
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

const parseCallDate = (str: string) => {
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split('.').map(Number);

  if (!year || !month || !day) return null;

  const [hour, minute] = timePart.split(':').map(Number);

  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day, hour, minute);
};

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
    class: row['Класс'],
    project: row['Проект'] || null,
    city: row['Куда звонил'] || null,
    call_order: row['№'] ? Number(row['№']) : null,
    duration_in_sec: durationToSeconds(row['Запись']) || 0,
    comment: row['Комментарий'] || null,
    redirect_number: row['Вызов завершен'],
  })).filter(row => row.date_time !== null && row.caller_number !== null);
};

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

  // --- Calls ---
  const callRows = parseCSV(callsPath);
  const callsData = normalizeCallData(callRows);

  await prisma.call.createMany({
    data: callsData,
    skipDuplicates: true,
  });
  console.log('Calls seeded');
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
