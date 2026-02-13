import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CallsService } from './calls.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.callsService.findAll(query);
  }
}
