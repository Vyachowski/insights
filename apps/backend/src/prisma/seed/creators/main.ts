import { createSiteMetricsCSV } from './site-metrics';
import { fromSrcRoot } from '../../../lib';
import { Site } from './types';
import fs from 'fs/promises';
// import { parseCSV } from './utils/parsers';
// import { validateSitesData } from './utils/validators';

export async function readSitesFromCSV(filePath: string): Promise<Site[]> {
  const text = await fs.readFile(filePath, 'utf8');

  const lines = text.trim().split('\n');
  const headers = lines.shift()?.split(',') ?? [];

  const now = new Date();

  return lines.map((line) => {
    const values = line.split(',');

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });

    const site: Site = {
      id: Number(row.id),
      cityId: Number(row.cityId),
      url: row.url,
      yandexCounterId: row.yandexCounterId || '',
      name: row.name || null,
      group: row.group || null,
      googleCounterId: row.googleCounterId || null,
      yandexTagManagerId: row.yandexTagManagerId || null,
      googleTagManagerId: row.googleTagManagerId || null,
      createdAt: now,
      updatedAt: now,
    };

    return site;
  });
}

async function main(year: number) {
  const outputPath = fromSrcRoot('prisma', 'seed', 'input', 'site-metrics');
  const sites = await readSitesFromCSV(
    fromSrcRoot('prisma', 'seed', 'input', 'sites.csv'),
  );

  await createSiteMetricsCSV({
    inputPath: '',
    outputPath,
    sites: sites,
    options: {
      source: 'api',
      startDate: new Date('2021-05-01'),
      endDate: new Date('2026-02-28'),
      years: [year],
    },
  });
}

void main(2025);
