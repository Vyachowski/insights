import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { MetricResponseDto } from './dto/metric-response.dto';

@ApiTags('Metrics')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOperation({ summary: 'Get site metrics filtered by site and date range' })
  @ApiWrappedResponse(MetricResponseDto, true)
  @Get()
  async findAll(@Query() query: AnalyticsQueryDto) {
    const metrics = await this.metricsService.findAll(query);
    return metrics.map((m) => new MetricResponseDto(m));
  }
}
