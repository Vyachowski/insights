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
    const periods = this.buildPeriods(dateService);

    const [data, citiesProfit] = await Promise.all([
      this.repo.fetchAllData(periods),
      this.fetchCitiesProfit(dateService),
    ]);

    return {
      lastWeekSummary: buildLastWeekSummary(data.lastWeek, periods.lastWeek),
      monthlyComparison: buildMonthlyComparison(
        data.currentMonth,
        data.lastYearSameMonth,
        periods,
      ),
      yearlyProfitTrend: buildYearlyTrend(data.yearlyWeeks),
      citiesProfit,
      businessHealth: buildBusinessHealth(data.yearlyWeeks),
    };
  }

  private buildPeriods(dateService: DateService): DashboardPeriods {
    const yearlyWeeks = dateService.getYearlyCompletedWeeks();

    return {
      lastWeek: dateService.getLastWeek(),
      currentMonth: dateService.getCurrentMonth(),
      lastYearSameMonth: dateService.getLastYearSameMonth(),
      currentYearWeeks: yearlyWeeks.currentYear,
      previousYearWeeks: yearlyWeeks.previousYear,
    };
  }

  private async fetchCitiesProfit(dateService: DateService) {
    const { currentYear, previousYear } = dateService.getComparablePeriods();
    const { totals, shareCurrent, sharePrevious } = await this.fetchProfitParts(
      currentYear,
      previousYear,
    );

    return [
      this.buildYearCities(
        currentYear,
        totals.currentYearTotalProfit,
        shareCurrent,
      ),
      this.buildYearCities(
        previousYear,
        totals.previousYearTotalProfit,
        sharePrevious,
      ),
    ];
  }

  private async fetchProfitParts(
    currentYear: { start: Date; end: Date },
    previousYear: { start: Date; end: Date },
  ) {
    const [totals, shareCurrent, sharePrevious] = await Promise.all([
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

    return { totals, shareCurrent, sharePrevious };
  }

  private buildYearCities(
    period: { start: Date; end: Date },
    totalProfit: number,
    share: { city: string; leadsShare: number }[],
  ) {
    return {
      year: period.start.getFullYear(),
      cities: this.profitService.calucalteCitiesProfit(totalProfit, share),
    };
  }
}
