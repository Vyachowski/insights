import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCookieAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { CallResponseDto } from './dto/call-response.dto';
import { CallImportResponseDto } from './dto/call-import-response.dto';

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

  @ApiOperation({ summary: 'Get call imports filtered by site and date range' })
  @ApiWrappedResponse(CallImportResponseDto, true)
  @Get('imports')
  findImports(@Query() query: AnalyticsQueryDto) {
    return this.callsService.findImports(query);
  }

  @ApiOperation({ summary: 'Import calls from Gudok CSV export (Russian headers)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.callsService.importFromCsv(file.buffer);
  }
}
