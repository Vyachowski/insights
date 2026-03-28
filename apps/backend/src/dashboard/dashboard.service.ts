import { Injectable } from '@nestjs/common';
import { DashboardResponseDto } from './dto/response-dashboard.dto';
import { DateService } from '@/lib';
import { ProfitService } from '@/profit/profit.service';
import { DashboardRepository, DashboardPeriods } from './dashboard.repository';
import {
  buildLastWeekSummary,
  buildMonthlyComparison,
  buildYearlyTrend,
  buildBusinessHealth,
} from './dashboard.builders';

@Injectable()
export class DashboardService {
  constructor(
    private repo: DashboardRepository,
    private profitService: ProfitService,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const dateService = new DateService();
    const yearlyWeeks = dateService.getYearlyCompletedWeeks();

    const periods: DashboardPeriods = {
      lastWeek: dateService.getLastWeek(),
      currentMonth: dateService.getCurrentMonth(),
      lastYearSameMonth: dateService.getLastYearSameMonth(),
      currentYearWeeks: yearlyWeeks.currentYear,
      previousYearWeeks: yearlyWeeks.previousYear,
    };

    const [data, citiesProfit] = await Promise.all([
      this.repo.fetchAllData(periods),
      this.fetchCitiesProfit(dateService),
    ]);

    const yearlyProfitTrend = buildYearlyTrend(data.yearlyWeeks);

    return {
      lastWeekSummary: buildLastWeekSummary(data.lastWeek, periods.lastWeek),
      monthlyComparison: buildMonthlyComparison(
        data.currentMonth,
        data.lastYearSameMonth,
        periods,
      ),
      yearlyProfitTrend,
      citiesProfit,
      businessHealth: buildBusinessHealth(data.yearlyWeeks),
    };
  }

  private async fetchCitiesProfit(dateService: DateService) {
    const { currentYear, previousYear } = dateService.getComparablePeriods();

    const [
      { currentYearTotalProfit, previousYearTotalProfit },
      profitShareCurrentYear,
      profitSharePreviousYear,
    ] = await Promise.all([
      this.profitService.getYearlyComparablePeriodsProfit(),
      this.profitService.calculateProfitShareByCities(
        currentYear.start,
        currentYear.end,
      ),
      this.profitService.calculateProfitShareByCities(
        previousYear.start,
        previousYear.end,
      ),
    ]);

    return [
      {
        year: currentYear.start.getFullYear(),
        cities: this.profitService.calucalteCitiesProfit(
          currentYearTotalProfit,
          profitShareCurrentYear,
        ),
      },
      {
        year: previousYear.start.getFullYear(),
        cities: this.profitService.calucalteCitiesProfit(
          previousYearTotalProfit,
          profitSharePreviousYear,
        ),
      },
    ];
  }
}
