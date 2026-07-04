import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { assertCsvColumns, assertSkipRate } from '@/common/utils/csv.utils';

const METRIC_COLUMNS = [
  'siteId',
  'date',
  'yandexUsers',
  'googleUsers',
  'otherUsers',
  'visitDurationYandexInSec',
  'visitDurationGoogleInSec',
  'visitDurationOtherInSec',
  'bounceYandex',
  'bounceGoogle',
  'bounceOther',
  'leadsYandex',
  'leadsGoogle',
  'leadsOther',
];

@Injectable()
export class MetricsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll({ siteId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.siteMetric.findMany({
      where: {
        siteId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }

  async importFromCsv(
    buffer: Buffer,
  ): Promise<{ created: number; skipped: number }> {
    const rows = this.parseMetricRows(buffer);

    let upserted = 0;
    let skipped = 0;

    for (const row of rows) {
      const ok = await this.upsertMetricRow(row);
      if (ok) upserted++;
      else skipped++;
    }

    assertSkipRate(upserted, skipped);
    return { created: upserted, skipped };
  }

  private parseMetricRows(buffer: Buffer): Record<string, string>[] {
    const rows: Record<string, string>[] = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    assertCsvColumns(rows, METRIC_COLUMNS);
    return rows;
  }

  private async upsertMetricRow(row: Record<string, string>): Promise<boolean> {
    const siteId = Number(row['siteId']);
    const date = row['date'] ? new Date(row['date']) : null;
    if (!siteId || isNaN(siteId) || !date || isNaN(date.getTime())) {
      return false;
    }

    const data = this.buildMetricData(row);
    await this.prismaService.siteMetric.upsert({
      where: { siteId_date: { siteId, date } },
      create: { siteId, date, ...data },
      update: data,
    });
    return true;
  }

  private buildMetricData(row: Record<string, string>) {
    return {
      yandexUsers: Number(row['yandexUsers'] ?? 0) || 0,
      googleUsers: Number(row['googleUsers'] ?? 0) || 0,
      otherUsers: Number(row['otherUsers'] ?? 0) || 0,
      visitDurationYandexInSec:
        Number(row['visitDurationYandexInSec'] ?? 0) || 0,
      visitDurationGoogleInSec:
        Number(row['visitDurationGoogleInSec'] ?? 0) || 0,
      visitDurationOtherInSec: Number(row['visitDurationOtherInSec'] ?? 0) || 0,
      bounceYandex: Number(row['bounceYandex'] ?? 0) || 0,
      bounceGoogle: Number(row['bounceGoogle'] ?? 0) || 0,
      bounceOther: Number(row['bounceOther'] ?? 0) || 0,
      leadsYandex: Number(row['leadsYandex'] ?? 0) || 0,
      leadsGoogle: Number(row['leadsGoogle'] ?? 0) || 0,
      leadsOther: Number(row['leadsOther'] ?? 0) || 0,
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
