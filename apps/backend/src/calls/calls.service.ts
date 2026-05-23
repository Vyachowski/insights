import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { assertCsvColumns, assertSkipRate } from '@/common/utils/csv.utils';

// City name aliases matching the seed normalizer logic
const CITY_ALIASES: Record<string, string[]> = {
  'новосибирск': ['нск'],
  'санкт-петербург': ['спб', 'петербург'],
  'нижний новгород': ['нижний'],
  'екатеринбург': ['екб'],
  'ростов-на-дону': ['ростов'],
  'набережные челны': ['челны'],
};

function resolveProjectTitle(raw: string): string {
  const cleaned = raw
    .replace(/^Дезинсекция – /, '')
    .replace(/ – Дезинсекция$/, '')
    .trim()
    .toLowerCase();

  for (const [canonical, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.includes(cleaned)) return canonical;
  }
  return cleaned;
}

function parseGudokDate(raw: string): Date | null {
  // Format: "31.12.25 12:05" → dd.MM.yy HH:mm
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, dd, mm, yy, hh, min] = match;
  return new Date(`20${yy}-${mm}-${dd}T${hh}:${min}:00`);
}

@Injectable()
export class CallsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll({ siteId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.call.findMany({
      where: {
        siteId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }

  findImports({ siteId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.callImport.findMany({
      where: {
        siteId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async importFromCsv(buffer: Buffer): Promise<{ created: number; skipped: number }> {
    const rows: Record<string, string>[] = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    assertCsvColumns(rows, ['Дата', 'Кто звонил', '№', 'Проект', 'Куда звонил']);
    const sites = await this.prismaService.site.findMany({
      select: { id: true, city: { select: { name: true } } },
    });

    const cityToSiteId = new Map(
      sites.map(s => [s.city.name.toLowerCase(), s.id]),
    );

    const records = rows.flatMap(row => {
      const date = parseGudokDate(row['Дата'] ?? '');
      const src = row['Кто звонил']?.trim();
      const callNumber = Number(row['№']);
      const projectTitle = resolveProjectTitle(row['Проект'] ?? '');
      const advChannelName = row['Куда звонил']?.trim() ?? '';
      const siteId = cityToSiteId.get(projectTitle);

      // Skip rows with no date, src, invalid callNumber, or unresolved siteId
      if (!date || !src || isNaN(callNumber) || siteId === undefined) return [];

      return [{
        siteId,
        date,
        src,
        region: row['Откуда']?.trim() || null,
        callNumber,
        class: row['Класс']?.trim() || null,
        projectTitle,
        advChannelName,
        billsec: 0,
        comment: row['Комментарий']?.trim() || null,
        redirectNumber: row['Вызов завершен']?.replace(/\D/g, '') || null,
        source: 'csv' as const,
      }];
    });

    const result = await this.prismaService.callImport.createMany({
      data: records,
      skipDuplicates: true,
    });

    const created = result.count;
    const skipped = records.length - result.count;
    assertSkipRate(created, skipped);
    return { created, skipped };
  }

  async importFromUrl(url: string): Promise<{ created: number; skipped: number }> {
    const res = await fetch(url);
    if (!res.ok) throw new BadRequestException(`Failed to fetch URL: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    return this.importFromCsv(buffer);
  }
}
