import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
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
}
