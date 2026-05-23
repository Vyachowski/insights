import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCookieAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { ImportUrlDto } from '@/common/dto/import-url.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { ExpenseResponseDto } from './dto/expense-response.dto';

@ApiTags('Expenses')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiOperation({ summary: 'Get expenses filtered by site and date range' })
  @ApiWrappedResponse(ExpenseResponseDto, true)
  @Get()
  async findAll(@Query() query: AnalyticsQueryDto) {
    const expenses = await this.expensesService.findAll(query);
    return expenses.map((e) => new ExpenseResponseDto(e));
  }

  @ApiOperation({ summary: 'Import expenses from CSV (date,type,siteId,amount)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.expensesService.importFromCsv(file.buffer);
  }

  @ApiOperation({ summary: 'Import expenses from URL pointing to a CSV file' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('import-url')
  importUrl(@Body() body: ImportUrlDto) {
    return this.expensesService.importFromUrl(body.url);
  }
}
