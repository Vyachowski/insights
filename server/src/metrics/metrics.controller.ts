import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.metricsService.findAll(query);
  }
}
