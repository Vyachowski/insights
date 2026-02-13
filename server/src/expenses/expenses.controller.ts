import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AnalyticsQueryDto } from '@/common/dto/analytics-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: AnalyticsQueryDto) {
    return this.expensesService.findAll(query);
  }
}
