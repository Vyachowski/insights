import fs from 'fs';
import { z } from 'zod';

export function parseCSV<T extends z.ZodTypeAny>(
  filepath: string,
  schema: T,
  delimiter = ',',
): z.infer<T>[] {
  const content = fs.readFileSync(filepath, 'utf-8');

  const lines = content.split('\n').filter(Boolean);
  const [headers, ...data] = lines;

  if (!headers || !data.length) {
    throw new Error('Формат файла не .csv или файл пустой');
  }

  const headersArray = headers.split(delimiter).map((h) => h.trim());

  return data.map((line) => {
    const values = line.split(delimiter).map((v) => v.trim());

    const obj = Object.fromEntries(headersArray.map((h, i) => [h, values[i]]));

    return schema.parse(obj);
  });
}
