import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialService {
  getDashboard() {
    return `This action returns all financial`;
  }

  private getWeeklySummary() {}
  private getMonthlyComparison() {}
  private getYearlyTrend() {}
  private getCitiesProfit() {}
  private getBusinessHealth() {}
}
