import { Controller, Get, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  findOne(@Query() query: AnalyticsQueryDto) {
    return this.revenueService.findAll(query);
  }
}
