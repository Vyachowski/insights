import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { ImportUrlDto } from '@/common/dto/import-url.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
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

  @ApiOperation({
    summary:
      'Import site metrics from CSV (columns: siteId,date,yandexUsers,...)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  importCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.metricsService.importFromCsv(file.buffer);
  }

  @ApiOperation({ summary: 'Import metrics from URL pointing to a CSV file' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('import-url')
  importUrl(@Body() body: ImportUrlDto) {
    return this.metricsService.importFromUrl(body.url);
  }
}
