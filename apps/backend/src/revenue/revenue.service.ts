import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { assertCsvColumns, assertSkipRate, fetchUrlToBuffer, parseCsvBuffer } from '@/common/utils/csv.utils';

@Injectable()
export class RevenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRevenueForPeriod(startDate: Date, endDate: Date) {
    const aggregation = await this.prismaService.revenue.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const amount = aggregation._sum.amount?.toNumber() ?? 0;

    return amount;
  }

  findAll({ siteId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.revenue.findMany({
      where: {
        siteId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }

  async importFromCsv(buffer: Buffer): Promise<{ created: number; updated: number; skipped: number }> {
    const rows = parseCsvBuffer(buffer);
    assertCsvColumns(rows, ['date', 'siteId', 'amount']);

    let created = 0, updated = 0, skipped = 0, invalid = 0;

    for (const row of rows) {
      const date = row['date'] ? new Date(row['date']) : null;
      const amount = Number(row['amount']);
      if (!date || isNaN(date.getTime()) || isNaN(amount)) { invalid++; continue; }

      const siteId = row['siteId'] ? Number(row['siteId']) : null;
      if (siteId !== null && isNaN(siteId)) { invalid++; continue; }

      const outcome = await this.upsertRow(date, siteId, amount).catch(() => 'invalid' as const);
      if (outcome === 'created') created++;
      else if (outcome === 'updated') updated++;
      else if (outcome === 'skipped') skipped++;
      else invalid++;
    }

    assertSkipRate(created + updated, invalid);
    return { created, updated, skipped };
  }

  private async upsertRow(date: Date, siteId: number | null, amount: number): Promise<'created' | 'updated' | 'skipped'> {
    const existing = await this.prismaService.revenue.findFirst({
      where: { date, siteId },
      select: { id: true, amount: true },
    });

    if (existing && existing.amount.toNumber() === amount) return 'skipped';

    const record = await this.prismaService.revenue.upsert({
      where: { id: existing?.id ?? -1 },
      create: { date, siteId, amount },
      update: { amount },
    });

    return record.createdAt.getTime() === record.updatedAt.getTime() ? 'created' : 'updated';
  }

  async importFromUrl(url: string): Promise<{ created: number; updated: number; skipped: number }> {
    return this.importFromCsv(await fetchUrlToBuffer(url));
  }

  async getRevenueGroupedByCity(startDate: Date, endDate: Date) {
    const result = await this.prismaService.revenue.groupBy({
      by: 'siteId',
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return result.map((item) => ({
      cityId: item.siteId ?? 0,
      profit: item._sum.amount?.toNumber() ?? 0,
    }));
  }
}
