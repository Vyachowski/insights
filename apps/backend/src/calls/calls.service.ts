import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

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
}
