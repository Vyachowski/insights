import { Controller, Get, Query } from '@nestjs/common';
import { CallsService } from './calls.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.callsService.findAll(query);
  }
}
