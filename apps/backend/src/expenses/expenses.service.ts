import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { assertCsvColumns, assertSkipRate } from '@/common/utils/csv.utils';

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

  async importFromCsv(buffer: Buffer): Promise<{ created: number; skipped: number }> {
    const rows: { date: string; type: string; siteId: string; amount: string }[] =
      parse(buffer, { columns: true, skip_empty_lines: true, trim: true, bom: true });

    assertCsvColumns(rows, ['date', 'type', 'siteId', 'amount']);
    let created = 0;
    let skipped = 0;

    for (const row of rows) {
      const date = new Date(row.date);
      const siteId = row.siteId ? Number(row.siteId) : null;
      const amount = parseFloat(row.amount);
      const type = row.type?.trim();

      if (!type || isNaN(amount) || isNaN(date.getTime())) {
        skipped++;
        continue;
      }

      try {
        const existing = await this.prismaService.expense.findFirst({
          where: { date, siteId, type },
        });
        if (existing) {
          await this.prismaService.expense.update({ where: { id: existing.id }, data: { amount } });
        } else {
          await this.prismaService.expense.create({ data: { date, siteId, amount, type } });
        }
        created++;
      } catch {
        skipped++;
      }
    }
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
