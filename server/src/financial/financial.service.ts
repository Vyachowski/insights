import { Injectable } from '@nestjs/common';
import {
  ResponseFinancialDto,
  WeeklySummaryDto,
  MonthlyComparisonDto,
  YearlyTrendDto,
  CitiesProfitDto,
} from './dto/response-financial.dto';

@Injectable()
export class FinancialService {
  getDashboard(): ResponseFinancialDto {
    const weeklySummary: WeeklySummaryDto = {
      weekStart: '2026-02-03',
      weekEnd: '2026-02-09',
      revenue: 120000,
      expenses: 85000,
      profit: 35000,
    };

    const monthlyComparison: MonthlyComparisonDto = {
      currentMonth: { month: '2026-02', profit: 140000 },
      lastYearSameMonth: { month: '2025-02', profit: 110000 },
      difference: 30000,
      percentage: 27,
    };

    const yearlyTrend: YearlyTrendDto = {
      currentYear: [
        { week: 1, profit: 28000 },
        { week: 2, profit: 31000 },
        { week: 3, profit: 29000 },
        { week: 4, profit: 33000 },
        { week: 5, profit: 35000 },
      ],
      lastYear: [
        { week: 1, profit: 22000 },
        { week: 2, profit: 25000 },
        { week: 3, profit: 23000 },
        { week: 4, profit: 26000 },
        { week: 5, profit: 28000 },
      ],
    };

    const citiesProfit: CitiesProfitDto = {
      year: 2026,
      cities: [
        { city: 'Москва', profit: 45000 },
        { city: 'Санкт-Петербург', profit: 32000 },
        { city: 'Казань', profit: 18000 },
        { city: 'Новосибирск', profit: 15000 },
        { city: 'Екатеринбург', profit: 12000 },
      ],
    };

    return {
      weeklySummary,
      monthlyComparison,
      yearlyTrend,
      citiesProfit,
    };
  }

  private getWeeklySummary() {}
  private getMonthlyComparison() {}
  private getYearlyTrend() {}
  private getCitiesProfit() {}
  private getBusinessHealth() {}
}
