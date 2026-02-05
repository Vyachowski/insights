import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CallsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll({ start_date, end_date }: AnalyticsQueryDto) {
    return this.prismaService.call.findMany({
      where: {
        // TODO: Change calls binding to site_id
        // city_id: site_id,
        date_time: {
          gte: start_date ? new Date(start_date) : undefined,
          lte: end_date ? new Date(end_date) : undefined,
        },
      },
    });
  }
}
