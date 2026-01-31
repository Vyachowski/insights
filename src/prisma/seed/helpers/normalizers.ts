import type { City } from "../../../generated/prisma";
import { convertDurationToSeconds } from "./converters";
import { parseCallDate } from "./parsers";

export const normalizeCallData = (
  callData: { [k: string]: string | undefined }[], 
  citiesData: City[]
) => {
  // Встроенный маппинг альтернативных названий городов
  const cityAltNames: Record<string, string[]> = {
    'новосибирск': ['нск'],
    'санкт-петербург': ['спб', 'петербург'],
    'нижний новгород': ['нижний'],
    'екатеринбург': ['екб'],
    'ростов-на-дону': ['ростов'],
    'набережные челны': ['челны'],
  };

  // Создаем маппинг: название (основное или альтернативное) -> city_id
  const cityNameToIdMap: Record<string, number> = {};

  citiesData.forEach((city) => {
    const cityName = city.name.toLowerCase();

    // Добавляем основное название
    cityNameToIdMap[cityName] = city.id;

    // Добавляем альтернативные названия
    const altNames = cityAltNames[cityName];
    if (altNames) {
      altNames.forEach(alt => {
        cityNameToIdMap[alt.toLowerCase()] = city.id;
      });
    }
  });

  // Функция для извлечения названия города из проекта
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