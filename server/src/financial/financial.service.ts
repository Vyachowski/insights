import { Injectable } from '@nestjs/common';
import {
  ResponseFinancialDto,
  MonthlyComparisonDto,
  YearlyTrendDto,
  CitiesProfitDto,
  LastWeekSummaryDto,
} from './dto/response-financial.dto';
import { WeekDateService } from '@/lib';
import { RevenueService } from '@/revenue/revenue.service';
import { ExpensesService } from '@/expenses/expenses.service';

@Injectable()
export class FinancialService {
  constructor(
    private revenueService: RevenueService,
    private expensesService: ExpensesService,
  ) {}

  async getDashboard(): Promise<ResponseFinancialDto> {
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
    const lastWeekSummary = await this.getLastFullWeekSummary();
    const monthlyComparison = this.getMonthlyComparison();
    // const yearlyTrend = this.getYearlyTrend();
    // const citiesProfit = this.getCitiesProfit();
    // const businessHealth = this.getBusinessHealth();

    return {
      lastWeekSummary,
      monthlyComparison,
      yearlyTrend,
      citiesProfit,
      // businessHealth,
    };
  }

  private async getLastFullWeekSummary(): Promise<LastWeekSummaryDto> {
    const lastWeekPeriod = new WeekDateService().getLastWeek();
    const revenue = await this.revenueService.getRevenueForPeriod(
      lastWeekPeriod.start,
      lastWeekPeriod.end,
    );

    const expenses = await this.expensesService.getExpensesForPeriod(
      lastWeekPeriod.start,
      lastWeekPeriod.end,
    );
    const profit = revenue - expenses;

    return {
      weekStart: lastWeekPeriod.start.toISOString(),
      weekEnd: lastWeekPeriod.end.toISOString(),
      revenue,
      expenses,
      profit,
    };
  }

  private getMonthlyComparison(): MonthlyComparisonDto {
    return {
      currentMonth: { month: '2026-02', profit: 140000 },
      lastYearSameMonth: { month: '2025-02', profit: 110000 },
      difference: 30000,
      percentage: 27,
    };
  }

  private getYearlyTrend() {}

  private getCitiesProfit() {}
  private getBusinessHealth() {}
}
