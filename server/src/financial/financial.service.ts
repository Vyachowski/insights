import { Injectable } from '@nestjs/common';
import {
  ResponseFinancialDto,
  MonthlyComparisonDto,
  YearlyTrendDto,
  LastWeekSummaryDto,
} from './dto/response-financial.dto';
import { DateService } from '@/lib';
import { RevenueService } from '@/revenue/revenue.service';
import { ExpensesService } from '@/expenses/expenses.service';
import { SitesService } from '@/sites/sites.service';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class FinancialService {
  constructor(
    private revenueService: RevenueService,
    private expensesService: ExpensesService,
    private sitesService: SitesService,
    private prismaService: PrismaService,
  ) {}

  async getDashboard(): Promise<ResponseFinancialDto> {
    const lastWeekSummary = await this.getLastFullWeekSummary();
    const monthlyComparison = await this.getMonthlyComparison();
    const yearlyTrend = await this.getYearlyTrend();
    const citiesProfit = await this.getCitiesProfit();
    const businessHealth = await this.getBusinessHealth();

    return {
      lastWeekSummary,
      monthlyComparison,
      yearlyTrend,
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

  private async getCitiesProfit() {
    const { currentYear, previousYear } =
      new DateService().getComparablePeriods();
    const { currentYearTotalProfit, previousYearTotalProfit } =
      await this.getYearlyComparablePeriodsProfit();

    const profitSharePreviousYear = await this.calculateProfitShareByCities(
      previousYear.start,
      previousYear.end,
    );

    const profitShareCurrentYear = await this.calculateProfitShareByCities(
      currentYear.start,
      currentYear.end,
    );

    const previousYearCitiesProfit = this.calucalteCitiesProfit(
      previousYearTotalProfit,
      profitSharePreviousYear,
    );

    const currentYearCitiesProfit = this.calucalteCitiesProfit(
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
      growthPercent: Number(growthPercent.toFixed(1)),
      avgCurrent: Math.round(avgCurrent),
      avgPrevious: Math.round(avgPrevious),
    };
  }

  private async getYearlyComparablePeriodsProfit() {
    const { currentYear, previousYear } =
      new DateService().getComparablePeriods();

    const currentYearTotalRevenue =
      await this.revenueService.getRevenueForPeriod(
        currentYear.start,
        currentYear.end,
      );
    const currentYearTotalExpenses =
      await this.expensesService.getExpensesForPeriod(
        currentYear.start,
        currentYear.end,
      );
    const previousYearTotalRevenue =
      await this.revenueService.getRevenueForPeriod(
        previousYear.start,
        previousYear.end,
      );
    const previousYearTotalExpenses =
      await this.expensesService.getExpensesForPeriod(
        previousYear.start,
        previousYear.end,
      );

    const currentYearTotalProfit =
      currentYearTotalRevenue - currentYearTotalExpenses;
    const previousYearTotalProfit =
      previousYearTotalRevenue - previousYearTotalExpenses;

    return { currentYearTotalProfit, previousYearTotalProfit };
  }

  private async calculateProfitShareByCities(startDate: Date, endDate: Date) {
    const acitveSites = await this.sitesService.getActiveSitesWithCities(
      startDate,
      endDate,
    );

    const totalFormLeads = await this.prismaService.siteMetric.aggregate({
      _sum: {
        leadsYandex: true,
        leadsGoogle: true,
        leadsOther: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalCallLeads = await this.prismaService.callImport.aggregate({
      _sum: {
        callNumber: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        callNumber: 1,
      },
    });

    const totalLeads =
      Number(totalFormLeads._sum.leadsGoogle) +
      Number(totalFormLeads._sum.leadsYandex) +
      Number(totalFormLeads._sum.leadsOther) +
      Number(totalCallLeads._sum.callNumber);

    const metrics = await this.prismaService.siteMetric.groupBy({
      by: 'siteId',
      _sum: {
        leadsYandex: true,
        leadsGoogle: true,
        leadsOther: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const calls = await this.prismaService.callImport.groupBy({
      by: 'siteId',
      _count: {
        id: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        callNumber: 1, // уникальные звонки
      },
    });

    return acitveSites.map((site) => {
      const siteMetrics = metrics.find((m) => m.siteId === site.id);
      const siteCalls = calls.find((c) => c.siteId === site.id);

      const formLeads = Object.values(siteMetrics?._sum ?? {}).reduce(
        (acc, val) => Number(acc) + Number(val),
        0,
      );
      const callsLeads = siteCalls ? siteCalls._count.id : 0;
      const totalSiteLeads = callsLeads + Number(formLeads);
      const leadsShare = Number((totalSiteLeads / totalLeads).toFixed(3));

      return {
        city: site.city.name,
        leadsShare,
      };
    });
  }

  private calucalteCitiesProfit(
    totalProfit: number,
    profitSharesByCity: {
      city: string;
      leadsShare: number;
    }[],
  ) {
    return profitSharesByCity.map((cityProfit) => ({
      city: cityProfit.city,
      profit: Math.floor(totalProfit * cityProfit.leadsShare),
    }));
  }
}
