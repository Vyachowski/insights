import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { CallResponseDto } from './dto/call-response.dto';

@ApiTags('Calls')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @ApiOperation({ summary: 'Get calls filtered by site and date range' })
  @ApiWrappedResponse(CallResponseDto, true)
  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.callsService.findAll(query);
  }
}
