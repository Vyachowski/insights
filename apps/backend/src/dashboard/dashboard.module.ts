import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RevenueModule } from '@/revenue/revenue.module';
import { ExpensesModule } from '@/expenses/expenses.module';
import { ProfitModule } from '@/profit/profit.module';

@Module({
  imports: [RevenueModule, ExpensesModule, ProfitModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
