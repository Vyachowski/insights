import { Injectable } from '@nestjs/common';
import {
  ResponseFinancialDto,
  MonthlyComparisonDto,
  YearlyTrendDto,
  CitiesProfitDto,
  LastWeekSummaryDto,
} from './dto/response-financial.dto';
import { DateService } from '@/lib';
import { RevenueService } from '@/revenue/revenue.service';
import { ExpensesService } from '@/expenses/expenses.service';

@Injectable()
export class FinancialService {
  constructor(
    private revenueService: RevenueService,
    private expensesService: ExpensesService,
  ) {}

  async getDashboard(): Promise<ResponseFinancialDto> {
    // const yearlyTrend: YearlyTrendDto = {
    //   currentYear: [
    //     { week: 1, profit: 28000 },
    //     { week: 2, profit: 31000 },
    //     { week: 3, profit: 29000 },
    //     { week: 4, profit: 33000 },
    //     { week: 5, profit: 35000 },
    //   ],
    //   lastYear: [
    //     { week: 1, profit: 22000 },
    //     { week: 2, profit: 25000 },
    //     { week: 3, profit: 23000 },
    //     { week: 4, profit: 26000 },
    //     { week: 5, profit: 28000 },
    //   ],
    // };

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
    const monthlyComparison = await this.getMonthlyComparison();
    const yearlyTrend = await this.getYearlyTrend();
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
    const lastWeekPeriod = new DateService().getLastWeek();
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

  private async getMonthlyComparison(): Promise<MonthlyComparisonDto> {
    const dateService = new DateService();

    const currentMonth = dateService.getCurrentMonth();
    const lastYearSameMonth = dateService.getLastYearSameMonth();

    const currentMonthRevenue = await this.revenueService.getRevenueForPeriod(
      currentMonth.start,
      currentMonth.end,
    );
    const currentMonthExpenses =
      await this.expensesService.getExpensesForPeriod(
        currentMonth.start,
        currentMonth.end,
      );
    const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;

    const lastYearRevenue = await this.revenueService.getRevenueForPeriod(
      lastYearSameMonth.start,
      lastYearSameMonth.end,
    );
    const lastYearExpenses = await this.expensesService.getExpensesForPeriod(
      lastYearSameMonth.start,
      lastYearSameMonth.end,
    );
    const lastYearProfit = lastYearRevenue - lastYearExpenses;

    const difference = currentMonthProfit - lastYearProfit;
    const percentage =
      lastYearProfit !== 0 ? (difference / lastYearProfit) * 100 : 0;

    return {
      currentMonth: {
        month: currentMonth.start.toISOString(),
        profit: currentMonthProfit,
      },
      lastYearSameMonth: {
        month: lastYearSameMonth.start.toISOString(),
        profit: lastYearProfit,
      },
      difference,
      percentage: Number(percentage.toFixed(1)),
    };
  }

  private async getYearlyTrend(): Promise<YearlyTrendDto> {
    const dateService = new DateService();
    const periods = dateService.getYearlyCompletedWeeks();

    const currentYearData = [];
    const lastYearData = [];

    for (let i = 0; i < periods.currentYear.length; i++) {
      const current = periods.currentYear[i];
      const last = periods.previousYear[i];

      const currentProfit =
        (await this.revenueService.getRevenueForPeriod(
          current.start,
          current.end,
        )) -
        (await this.expensesService.getExpensesForPeriod(
          current.start,
          current.end,
        ));

      const lastProfit =
        (await this.revenueService.getRevenueForPeriod(last.start, last.end)) -
        (await this.expensesService.getExpensesForPeriod(last.start, last.end));

      currentYearData.push({ week: i + 1, profit: currentProfit });
      lastYearData.push({ week: i + 1, profit: lastProfit });
    }

    return {
      currentYear: currentYearData,
      lastYear: lastYearData,
    };
  }

  // private async getCitiesProfit(): Promise<CitiesProfitDto> {}

  private async getBusinessHealth() {
    const yearlyTrend = await this.getYearlyTrend();

    const avgCurrent =
      yearlyTrend.currentYear.reduce((sum, w) => sum + w.profit, 0) /
      yearlyTrend.currentYear.length;
    const avgPrevious =
      yearlyTrend.lastYear.reduce((sum, w) => sum + w.profit, 0) /
      yearlyTrend.lastYear.length;

    const growthPercent = ((avgCurrent - avgPrevious) / avgPrevious) * 100;

    return {
      isGrowing: growthPercent > 0,
      growthPercent: Number(Math.abs(growthPercent).toFixed(1)),
      avgCurrent: Math.round(avgCurrent),
      avgPrevious: Math.round(avgPrevious),
    };
  }
}
