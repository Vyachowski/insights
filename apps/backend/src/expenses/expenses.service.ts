import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

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

  findAll({ cityId, startDate, endDate }: AnalyticsQueryDto) {
    return this.prismaService.expense.findMany({
      where: {
        cityId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }
}
