import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { DashboardResponseDto } from './dto/response-dashboard.dto';

@ApiTags('Dashboard')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get dashboard summary with weekly, monthly, and yearly analytics',
  })
  @ApiWrappedResponse(DashboardResponseDto)
  @Get('summary')
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
