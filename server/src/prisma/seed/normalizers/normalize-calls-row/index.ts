import type { CallImport } from '../../schemas';

const CITY_NAMES: Record<string, string[]> = {
  новосибирск: ['нск'],
  'санкт-петербург': ['спб', 'петербург'],
  'нижний новгород': ['нижний'],
  екатеринбург: ['екб'],
  'ростов-на-дону': ['ростов'],
  'набережные челны': ['челны'],
};

function parseCityNameFromProject(projectTitle: string): string {
  return projectTitle
    .replace(/^Дезинсекция – /, '')
    .replace(/ – Дезинсекция$/, '')
    .trim()
    .toLowerCase();
}

function resolveCityName(input: string): string | null {
  const lower = input.trim().toLowerCase();

  for (const [normalized, variants] of Object.entries(CITY_NAMES)) {
    if (variants.some((v) => v.toLowerCase() === lower)) {
      return normalized;
    }
  }

  return null;
}

export function normalizeCallRow(call: CallImport) {
  const [datePart, timePart] = call.Дата.split(' ');

  const [day, month, year] = datePart.split('.');
  const fullYear = `20${year}`;

  const date = new Date(`${fullYear}-${month}-${day}T${timePart}`);
  const parsedProjectTitle = parseCityNameFromProject(call.Проект.trim());
  const projectTitle =
    resolveCityName(parsedProjectTitle) ?? parsedProjectTitle;

  return {
    date,
    src: call['Кто звонил'].trim(),
    region: call.Откуда ? call.Откуда.trim() : null,
    callNumber: Number(call['№']),
    class: call.Класс || null,
    projectTitle,
    advChannelName: call['Куда звонил'].trim(),
    billsec: 0,
    comment: call.Комментарий || null,
    redirectNumber: call['Вызов завершен']
      ? call['Вызов завершен'].replace(/\D/g, '')
      : null,
  };
}
