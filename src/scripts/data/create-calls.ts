import fs from 'fs/promises';
import type { City } from "../../generated/prisma";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { parseCallDate, parseCSV } from "../../prisma/seed/utils/parsers";
import { convertDurationToSeconds } from "../../prisma/seed/utils/converters";
import path from 'path';

export const normalizeCallData = (
  callData: { [k: string]: string | undefined }[], 
  citiesData: City[]
) => {
  const cityAltNames: Record<string, string[]> = {
    'новосибирск': ['нск'],
    'санкт-петербург': ['спб', 'петербург'],
    'нижний новгород': ['нижний'],
    'екатеринбург': ['екб'],
    'ростов-на-дону': ['ростов'],
    'набережные челны': ['челны'],
  };

  const cityNameToIdMap: Record<string, number> = {};

  citiesData.forEach((city) => {
    const cityName = city.name.toLowerCase();

    cityNameToIdMap[cityName] = city.id;

    const altNames = cityAltNames[cityName];
    if (altNames) {
      altNames.forEach(alt => {
        cityNameToIdMap[alt.toLowerCase()] = city.id;
      });
    }
  });

  const parseCityName = (project: string) => 
    project
      .replaceAll('Дезинсекция – ', '')
      .replaceAll(' – Дезинсекция', '')
      .trim()
      .toLowerCase();

  return callData.map((row: any) => {
    const dateTime = parseCallDate(row['Дата']);
    if (!dateTime || !row['Кто звонил']) return null;

    const cityName = parseCityName(row['Проект'] || '');
    const city_id = cityNameToIdMap[cityName];

    if (!city_id) {
      console.warn(`City not found for call: ${row['Проект']} (parsed as: ${cityName})`);
      return null;
    }

    return {
      date_time: dateTime,
      caller_number: row['Кто звонил'] || null,
      region: row['Откуда'] || null,
      class: row['Класс'] || null,
      project: row['Проект'],
      number_name: row['Куда звонил'],
      call_order: Number(row['№']),
      duration_in_sec: convertDurationToSeconds(row['Запись']) || 0,
      comment: row['Комментарий'] || null,
      redirect_number: row['Вызов завершен'],
      city_id,
    };
  }).filter(Boolean);
};

async function createCallsCSV() {
  const cities = await prisma.city.findMany();
  const callsData = parseCSV(config.paths.import.calls);

  const normalizedData = normalizeCallData(callsData, cities);

  const filePath = config.paths.output.calls;
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const headers = [
    "city_id",
    "date_time",
    "caller_number",
    "region",
    "call_order",
    "class",
    "number_name",
    "project",
    "duration_in_sec",
    "comment",
    "redirect_number",
  ];

  const lines = [headers.join(",")];

  normalizedData.forEach((row) => {
    if (row) {
      const line = [
        row.city_id,
        row.date_time.toISOString(),
        `"${row.caller_number || ""}"`,
        `"${row.region || ""}"`,
        row.call_order,
        `"${row.class || ""}"`,
        `"${row.number_name || ""}"`,
        `"${row.project || ""}"`,
        row.duration_in_sec ?? 0,
        `"${row.comment || ""}"`,
        `"${row.redirect_number || ""}"`,
      ].join(",");

      lines.push(line);
    }
  });

  await fs.writeFile(filePath, lines.join("\n"));
}

await createCallsCSV();
