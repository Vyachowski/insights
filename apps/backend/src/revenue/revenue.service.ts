import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { parse } from 'csv-parse/sync';

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

  async importFromCsv(buffer: Buffer): Promise<{ created: number; skipped: number }> {
    const rows: Record<string, string>[] = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    let created = 0;
    let skipped = 0;

    for (const row of rows) {
      const date = row['date'] ? new Date(row['date']) : null;
      const amount = Number(row['amount']);
      if (!date || isNaN(date.getTime()) || isNaN(amount)) { skipped++; continue; }

      const siteId = row['siteId'] ? Number(row['siteId']) : null;
      if (siteId !== null && isNaN(siteId)) { skipped++; continue; }

      const existing = await this.prismaService.revenue.findFirst({
        where: { date, siteId },
      });

      if (existing) {
        await this.prismaService.revenue.update({ where: { id: existing.id }, data: { amount } });
      } else {
        await this.prismaService.revenue.create({ data: { date, siteId, amount } });
      }
      created++;
    }

    return { created, skipped };
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
