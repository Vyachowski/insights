import fs from 'fs';

export const parseCSV = (filepath: string, delimeter = ',') => {
  const content = fs.readFileSync(filepath, 'utf-8');

  const lines = content.split('\n').filter(Boolean);
  const [headers, ...data] = lines;

  if (!headers || !data)
    throw new Error('Формат файла не .csv или файл пустой');

  const headersArray = headers.split(delimeter).map((h) => h.trim());

  return data.map((line) => {
    const values = line.split(delimeter).map((v) => v.trim());

    return Object.fromEntries(headersArray.map((h, i) => [h, values[i]]));
  });
};

export const parseCallDate = (str: string) => {
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split('.').map(Number);
  if (!year || !month || !day) return null;

  const [hour, minute] = timePart.split(':').map(Number);

  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day, hour, minute);
};
