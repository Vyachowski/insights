import { PrismaService } from '@/database/prisma.service';
import { ExpensesService } from '@/expenses/expenses.service';
import { DateService } from '@/lib';
import { RevenueService } from '@/revenue/revenue.service';
import { SitesService } from '@/sites/sites.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfitService {
  constructor(
    private revenueService: RevenueService,
    private expensesService: ExpensesService,
    private sitesService: SitesService,
    private prismaService: PrismaService,
  ) {}

  async getYearlyComparablePeriodsProfit() {
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

  async calculateProfitShareByCities(startDate: Date, endDate: Date) {
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

  calucalteCitiesProfit(
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
