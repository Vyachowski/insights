import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCookieAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RevenueService } from './revenue.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
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

  @ApiOperation({ summary: 'Import revenue from CSV (columns: date,siteId,amount)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.revenueService.importFromCsv(file.buffer);
  }
}
