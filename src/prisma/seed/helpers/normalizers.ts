import { convertDurationToSeconds } from "./converters";
import { parseCallDate } from "./parsers";

export const normalizeCallData = (callData: { [k: string]: string | undefined }[], citiesData: {
    [k: string]: string | undefined;
}[]) => {
  // Создаем маппинг: alt_name/name -> city_id
  const cityAltNamesMap: Record<string, number> = {};
  
  citiesData.forEach((city, index) => {
    const cityId = index + 1; // или city.id если он есть
    
    // Добавляем основное название
    cityAltNamesMap[city.name.toLowerCase()] = cityId;
    
    // Добавляем альтернативные названия
    if (city.alt_names) {
      let altNames: string[] = [];
      try {
        altNames = typeof city.alt_names === 'string' 
          ? JSON.parse(city.alt_names) 
          : city.alt_names;
      } catch (e) {
        console.warn(`Failed to parse alt_names for city ${city.name}`, e);
      }
      
      if (Array.isArray(altNames)) {
        altNames.forEach(alt => {
          if (typeof alt === 'string') {
            cityAltNamesMap[alt.toLowerCase()] = cityId;
          }
        });
      }
    }
  });

  // Функция для извлечения названия города из проекта
  const parseCityName = (project: string) => 
    project.replaceAll('Дезинсекция – ', '').replaceAll(' – Дезинсекция', '').toLowerCase();

  return callData.map((row: any) => {
    const dateTime = parseCallDate(row['Дата']);
    if (!dateTime || !row['Кто звонил']) return null;

    const cityName = parseCityName(row['Проект'] || '');
    const city_id = cityAltNamesMap[cityName];

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
