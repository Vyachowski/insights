import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

@Injectable()
export class RevenueService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll({ city_id, start_date, end_date }: AnalyticsQueryDto) {
    return this.prismaService.revenue.findMany({
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
