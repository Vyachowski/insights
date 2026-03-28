import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

export interface PeriodData {
  revenue: number;
  expenses: number;
  profit: number;
}

export interface WeekData {
  week: number;
  current: PeriodData;
  previous: PeriodData;
}

export interface DashboardRawData {
  lastWeek: PeriodData;
  currentMonth: PeriodData;
  lastYearSameMonth: PeriodData;
  yearlyWeeks: WeekData[];
}

export interface Period {
  start: Date;
  end: Date;
}

export interface DashboardPeriods {
  lastWeek: Period;
  currentMonth: Period;
  lastYearSameMonth: Period;
  currentYearWeeks: Period[];
  previousYearWeeks: Period[];
}

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) {}

  async fetchAllData(periods: DashboardPeriods): Promise<DashboardRawData> {
    const [lastWeek, currentMonth, lastYearSameMonth, yearlyWeeks] =
      await Promise.all([
        this.fetchPeriodData(periods.lastWeek),
        this.fetchPeriodData(periods.currentMonth),
        this.fetchPeriodData(periods.lastYearSameMonth),
        this.fetchYearlyWeeks(
          periods.currentYearWeeks,
          periods.previousYearWeeks,
        ),
      ]);

    return { lastWeek, currentMonth, lastYearSameMonth, yearlyWeeks };
  }

  private async fetchPeriodData({ start, end }: Period): Promise<PeriodData> {
    const [revenueData, expensesData] = await Promise.all([
      this.prisma.revenue.aggregate({
        _sum: { amount: true },
        where: { date: { gte: start, lte: end } },
      }),
      this.prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: start, lte: end } },
      }),
    ]);

    const revenue = revenueData._sum.amount?.toNumber() ?? 0;
    const expenses = expensesData._sum.amount?.toNumber() ?? 0;

    return { revenue, expenses, profit: revenue - expenses };
  }

  private async fetchYearlyWeeks(
    currentYearPeriods: Period[],
    previousYearPeriods: Period[],
  ): Promise<WeekData[]> {
    return Promise.all(
      currentYearPeriods.map(async (current, i) => {
        const [currentData, previousData] = await Promise.all([
          this.fetchPeriodData(current),
          this.fetchPeriodData(previousYearPeriods[i]),
        ]);

        return { week: i + 1, current: currentData, previous: previousData };
      }),
    );
  }
}
