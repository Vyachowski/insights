import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

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

  findAll({ cityId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.revenue.findMany({
      where: {
        cityId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }

  async getRevenueGroupedByCity(startDate: Date, endDate: Date) {
    const result = await this.prismaService.revenue.groupBy({
      by: 'cityId',
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
      cityId: item.cityId ?? 0,
      profit: item._sum.amount?.toNumber() ?? 0,
    }));
  }
}
