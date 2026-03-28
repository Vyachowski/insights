import { PeriodData, WeekData, DashboardPeriods } from './dashboard.repository';
import {
  LastWeekSummaryDto,
  MonthlyComparisonDto,
  YearlyProfitTrendPointDto,
} from './dto/response-dashboard.dto';

export function buildLastWeekSummary(
  data: PeriodData,
  period: { start: Date; end: Date },
): LastWeekSummaryDto {
  return {
    weekStart: period.start.toISOString(),
    weekEnd: period.end.toISOString(),
    ...data,
  };
}

export function buildMonthlyComparison(
  currentMonth: PeriodData,
  lastYearSameMonth: PeriodData,
  periods: DashboardPeriods,
): MonthlyComparisonDto {
  const difference = currentMonth.profit - lastYearSameMonth.profit;
  const percentage =
    lastYearSameMonth.profit !== 0
      ? (difference / lastYearSameMonth.profit) * 100
      : 0;

  return {
    currentMonth: {
      month: periods.currentMonth.start.toISOString(),
      profit: currentMonth.profit,
    },
    lastYearSameMonth: {
      month: periods.lastYearSameMonth.start.toISOString(),
      profit: lastYearSameMonth.profit,
    },
    difference,
    percentage: Number(percentage.toFixed(1)),
  };
}

export function buildYearlyTrend(
  weeks: WeekData[],
): YearlyProfitTrendPointDto[] {
  return weeks.map(({ week, current, previous }) => ({
    week,
    current: current.profit,
    previous: previous.profit,
  }));
}

export function buildBusinessHealth(weeks: WeekData[]) {
  const avgCurrent =
    weeks.reduce((sum, w) => sum + w.current.profit, 0) / weeks.length;
  const avgPrevious =
    weeks.reduce((sum, w) => sum + w.previous.profit, 0) / weeks.length;
  const growthPercent = ((avgCurrent - avgPrevious) / avgPrevious) * 100;

  return {
    isGrowing: growthPercent > 0,
    growthPercent: Number(growthPercent.toFixed(1)),
    avgCurrent: Math.round(avgCurrent),
    avgPrevious: Math.round(avgPrevious),
  };
}
