import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { assertCsvColumns, assertSkipRate } from '@/common/utils/csv.utils';

// City name aliases matching the seed normalizer logic
const CITY_ALIASES: Record<string, string[]> = {
  новосибирск: ['нск'],
  'санкт-петербург': ['спб', 'петербург'],
  'нижний новгород': ['нижний'],
  екатеринбург: ['екб'],
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

  async importFromCsv(
    buffer: Buffer,
  ): Promise<{ created: number; skipped: number }> {
    const rows = this.parseCallRows(buffer);
    const cityToSiteId = await this.buildCityToSiteIdMap();
    const { records, invalidCount } = this.buildCallRecords(rows, cityToSiteId);

    const result = await this.prismaService.callImport.createMany({
      data: records,
      skipDuplicates: true,
    });

    assertSkipRate(records.length, invalidCount);
    return {
      created: result.count,
      skipped: records.length - result.count,
    };
  }

  private parseCallRows(buffer: Buffer): Record<string, string>[] {
    const rows: Record<string, string>[] = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    assertCsvColumns(rows, [
      'Дата',
      'Кто звонил',
      '№',
      'Проект',
      'Куда звонил',
    ]);
    return rows;
  }

  private buildCallRecords(
    rows: Record<string, string>[],
    cityToSiteId: Map<string, number>,
  ) {
    let invalidCount = 0;

    const records = rows.flatMap((row) => {
      const record = this.mapRowToCallImport(row, cityToSiteId);
      if (!record) {
        invalidCount++;
        return [];
      }
      return [record];
    });

    return { records, invalidCount };
  }

  private async buildCityToSiteIdMap(): Promise<Map<string, number>> {
    const sites = await this.prismaService.site.findMany({
      select: { id: true, city: { select: { name: true } } },
    });

    return new Map(sites.map((s) => [s.city.name.toLowerCase(), s.id]));
  }

  private mapRowToCallImport(
    row: Record<string, string>,
    cityToSiteId: Map<string, number>,
  ) {
    const date = parseGudokDate(row['Дата'] ?? '');
    const src = row['Кто звонил']?.trim();
    const callNumber = Number(row['№']);
    const projectTitle = resolveProjectTitle(row['Проект'] ?? '');
    const siteId = cityToSiteId.get(projectTitle);

    // Skip rows with no date, src, invalid callNumber, or unresolved siteId
    if (!date || !src || isNaN(callNumber) || siteId === undefined) {
      return null;
    }

    return this.toCallImportRow(row, {
      siteId,
      date,
      src,
      callNumber,
      projectTitle,
    });
  }

  private toCallImportRow(
    row: Record<string, string>,
    base: {
      siteId: number;
      date: Date;
      src: string;
      callNumber: number;
      projectTitle: string;
    },
  ) {
    return {
      ...base,
      region: row['Откуда']?.trim() || null,
      class: row['Класс']?.trim() || null,
      advChannelName: row['Куда звонил']?.trim() ?? '',
      billsec: 0,
      comment: row['Комментарий']?.trim() || null,
      redirectNumber: row['Вызов завершен']?.replace(/\D/g, '') || null,
      source: 'csv' as const,
    };
  }

  async importFromUrl(
    url: string,
  ): Promise<{ created: number; skipped: number }> {
    const res = await fetch(url);
    if (!res.ok)
      throw new BadRequestException(`Failed to fetch URL: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    return this.importFromCsv(buffer);
  }
}
