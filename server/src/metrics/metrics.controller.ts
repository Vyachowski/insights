import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.metricsService.findAll(query);
  }
}
