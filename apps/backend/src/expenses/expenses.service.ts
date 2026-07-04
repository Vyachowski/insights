import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  assertCsvColumns,
  assertSkipRate,
  fetchUrlToBuffer,
  parseCsvBuffer,
} from '@/common/utils/csv.utils';

@Injectable()
export class ExpensesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getExpensesForPeriod(startDate: Date, endDate: Date) {
    const aggregation = await this.prismaService.expense.aggregate({
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
    return this.prismaService.expense.findMany({
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
  ): Promise<{ created: number; updated: number; skipped: number }> {
    const rows = parseCsvBuffer(buffer);
    assertCsvColumns(rows, ['date', 'type', 'siteId', 'amount']);

    let created = 0,
      updated = 0,
      skipped = 0,
      invalid = 0;

    for (const row of rows) {
      const date = new Date(row['date']);
      const siteId = row['siteId'] ? Number(row['siteId']) : null;
      const amount = parseFloat(row['amount']);
      const type = row['type']?.trim();

      if (!type || isNaN(amount) || isNaN(date.getTime())) {
        invalid++;
        continue;
      }

      const outcome = await this.upsertRow(date, siteId, amount, type).catch(
        () => 'invalid' as const,
      );
      if (outcome === 'created') created++;
      else if (outcome === 'updated') updated++;
      else if (outcome === 'skipped') skipped++;
      else invalid++;
    }

    assertSkipRate(created + updated + skipped, invalid);
    return { created, updated, skipped };
  }

  private async upsertRow(
    date: Date,
    siteId: number | null,
    amount: number,
    type: string,
  ): Promise<'created' | 'updated' | 'skipped'> {
    const existing = await this.prismaService.expense.findFirst({
      where: { date, siteId, type },
      select: { id: true, amount: true },
    });

    if (existing && existing.amount.toNumber() === amount) return 'skipped';

    const record = await this.prismaService.expense.upsert({
      where: { id: existing?.id ?? -1 },
      create: { date, siteId, amount, type },
      update: { amount },
    });

    return record.createdAt.getTime() === record.updatedAt.getTime()
      ? 'created'
      : 'updated';
  }

  async importFromUrl(
    url: string,
  ): Promise<{ created: number; updated: number; skipped: number }> {
    return this.importFromCsv(await fetchUrlToBuffer(url));
  }
}
