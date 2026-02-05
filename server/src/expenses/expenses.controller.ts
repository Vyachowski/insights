import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.expensesService.findAll(query);
  }
}
