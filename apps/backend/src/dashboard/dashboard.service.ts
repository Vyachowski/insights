import { Injectable } from '@nestjs/common';
import {
  DashboardResponseDto,
  MonthlyComparisonDto,
  LastWeekSummaryDto,
  YearlyProfitTrendPointDto,
} from './dto/response-dashboard.dto';
import { DateService } from '@/lib';
import { RevenueService } from '@/revenue/revenue.service';
import { ExpensesService } from '@/expenses/expenses.service';
import { ProfitService } from '@/profit/profit.service';

@Injectable()
export class DashboardService {
  constructor(
    private revenueService: RevenueService,
    private expensesService: ExpensesService,
    private profitService: ProfitService,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const lastWeekSummary = await this.getLastFullWeekSummary();
    const monthlyComparison = await this.getMonthlyComparison();
    const yearlyProfitTrend = await this.getYearlyProfitTrend();
    const citiesProfit = await this.getCitiesProfit();
    const businessHealth = await this.getBusinessHealth();

    return {
      lastWeekSummary,
      monthlyComparison,
      yearlyProfitTrend,
      citiesProfit,
      businessHealth,
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

  private async getYearlyProfitTrend(): Promise<YearlyProfitTrendPointDto[]> {
    const dateService = new DateService();
    const periods = dateService.getYearlyCompletedWeeks();

    const result: YearlyProfitTrendPointDto[] = [];

    for (let i = 0; i < periods.currentYear.length; i++) {
      const current = periods.currentYear[i];
      const previous = periods.previousYear[i];

      const currentProfit =
        (await this.revenueService.getRevenueForPeriod(
          current.start,
          current.end,
        )) -
        (await this.expensesService.getExpensesForPeriod(
          current.start,
          current.end,
        ));

      const previousProfit =
        (await this.revenueService.getRevenueForPeriod(
          previous.start,
          previous.end,
        )) -
        (await this.expensesService.getExpensesForPeriod(
          previous.start,
          previous.end,
        ));

      result.push({
        week: i + 1,
        current: currentProfit,
        previous: previousProfit,
      });
    }

    return result;
  }

  private async getCitiesProfit() {
    const { currentYear, previousYear } =
      new DateService().getComparablePeriods();
    const { currentYearTotalProfit, previousYearTotalProfit } =
      await this.profitService.getYearlyComparablePeriodsProfit();

    const profitSharePreviousYear =
      await this.profitService.calculateProfitShareByCities(
        previousYear.start,
        previousYear.end,
      );

    const profitShareCurrentYear =
      await this.profitService.calculateProfitShareByCities(
        currentYear.start,
        currentYear.end,
      );

    const previousYearCitiesProfit = this.profitService.calucalteCitiesProfit(
      previousYearTotalProfit,
      profitSharePreviousYear,
    );

    const currentYearCitiesProfit = this.profitService.calucalteCitiesProfit(
      currentYearTotalProfit,
      profitShareCurrentYear,
    );

    return [
      {
        year: currentYear.start.getFullYear(),
        cities: currentYearCitiesProfit,
      },
      {
        year: previousYear.start.getFullYear(),
        cities: previousYearCitiesProfit,
      },
    ];
  }

  private async getBusinessHealth() {
    const yearlyTrend = await this.getYearlyProfitTrend();

    const avgCurrent =
      yearlyTrend.reduce((sum, w) => sum + w.current, 0) / yearlyTrend.length;

    const avgPrevious =
      yearlyTrend.reduce((sum, w) => sum + w.previous, 0) / yearlyTrend.length;

    const growthPercent = ((avgCurrent - avgPrevious) / avgPrevious) * 100;

    return {
      isGrowing: growthPercent > 0,
      growthPercent: Number(growthPercent.toFixed(1)),
      avgCurrent: Math.round(avgCurrent),
      avgPrevious: Math.round(avgPrevious),
    };
  }
}
