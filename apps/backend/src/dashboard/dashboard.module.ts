import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProfitModule } from '@/profit/profit.module';
import { DashboardRepository } from './dashboard.repository';

@Module({
  imports: [ProfitModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
