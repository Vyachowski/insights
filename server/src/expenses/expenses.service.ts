import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpensesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll({ city_id, start_date, end_date }: AnalyticsQueryDto) {
    return this.prismaService.expense.findMany({
      where: {
        city_id,
        date: {
          gte: start_date ? new Date(start_date) : undefined,
          lte: end_date ? new Date(end_date) : undefined,
        },
      },
    });
  }
}
