import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RevenueService } from './revenue.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { RevenueResponseDto } from './dto/revenue-response.dto';

@ApiTags('Revenue')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @ApiOperation({
    summary: 'Get revenue entries filtered by site and date range',
  })
  @ApiWrappedResponse(RevenueResponseDto, true)
  @Get()
  async findAll(@Query() query: AnalyticsQueryDto) {
    const entries = await this.revenueService.findAll(query);
    return entries.map((r) => new RevenueResponseDto(r));
  }
}
