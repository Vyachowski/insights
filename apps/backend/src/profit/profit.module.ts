import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';
import { ExpensesModule } from '@/expenses/expenses.module';
import { RevenueModule } from '@/revenue/revenue.module';
import { SitesModule } from '@/sites/sites.module';

@Module({
  imports: [RevenueModule, ExpensesModule, SitesModule],
  controllers: [ProfitController],
  providers: [ProfitService],
  exports: [ProfitService],
})
export class ProfitModule {}
