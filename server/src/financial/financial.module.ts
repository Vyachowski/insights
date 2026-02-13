import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { RevenueModule } from '@/revenue/revenue.module';
import { ExpensesModule } from '@/expenses/expenses.module';
import { ProfitModule } from '@/profit/profit.module';

@Module({
  imports: [RevenueModule, ExpensesModule, ProfitModule],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}
