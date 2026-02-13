import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Query() query: AnalyticsQueryDto) {
    return this.revenueService.findAll(query);
  }
}
