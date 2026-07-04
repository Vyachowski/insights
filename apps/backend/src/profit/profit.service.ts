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

    const currentYearTotalProfit = await this.periodProfit(currentYear);
    const previousYearTotalProfit = await this.periodProfit(previousYear);

    return { currentYearTotalProfit, previousYearTotalProfit };
  }

  private async periodProfit(period: {
    start: Date;
    end: Date;
  }): Promise<number> {
    const revenue = await this.revenueService.getRevenueForPeriod(
      period.start,
      period.end,
    );
    const expenses = await this.expensesService.getExpensesForPeriod(
      period.start,
      period.end,
    );

    return revenue - expenses;
  }

  async calculateProfitShareByCities(startDate: Date, endDate: Date) {
    const activeSites = await this.sitesService.getActiveSitesWithCities(
      startDate,
      endDate,
    );
    const totalFormLeads = await this.aggregateFormLeads(startDate, endDate);
    const totalCallLeads = await this.aggregateCallLeads(startDate, endDate);

    const totalLeads =
      Number(totalFormLeads._sum.leadsGoogle) +
      Number(totalFormLeads._sum.leadsYandex) +
      Number(totalFormLeads._sum.leadsOther) +
      Number(totalCallLeads._sum.callNumber);

    const metrics = await this.groupFormLeadsBySite(startDate, endDate);
    const calls = await this.groupCallLeadsBySite(startDate, endDate);

    return activeSites.map((site) =>
      this.toCityLeadsShare(site, metrics, calls, totalLeads),
    );
  }

  private aggregateFormLeads(startDate: Date, endDate: Date) {
    return this.prismaService.siteMetric.aggregate({
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
  }

  private aggregateCallLeads(startDate: Date, endDate: Date) {
    return this.prismaService.callImport.aggregate({
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
  }

  private groupFormLeadsBySite(startDate: Date, endDate: Date) {
    return this.prismaService.siteMetric.groupBy({
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
  }

  private groupCallLeadsBySite(startDate: Date, endDate: Date) {
    return this.prismaService.callImport.groupBy({
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
  }

  private toCityLeadsShare(
    site: { id: number; city: { name: string } },
    metrics: { siteId: number | null; _sum: Record<string, unknown> }[],
    calls: { siteId: number | null; _count: { id: number } }[],
    totalLeads: number,
  ) {
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
