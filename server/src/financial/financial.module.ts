import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { RevenueModule } from '@/revenue/revenue.module';
import { ExpensesModule } from '@/expenses/expenses.module';
import { SitesModule } from '@/sites/sites.module';
import { CitiesModule } from '@/cities/cities.module';

@Module({
  imports: [RevenueModule, ExpensesModule, SitesModule, CitiesModule],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}
