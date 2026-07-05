export interface LastWeekSummaryDto {
  weekStart: string;
  weekEnd: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MonthlyProfitDto {
  month: string;
  profit: number;
}

export interface MonthlyComparisonDto {
  currentMonth: MonthlyProfitDto;
  lastYearSameMonth: MonthlyProfitDto;
  difference: number;
  percentage: number;
}

export interface YearlyProfitTrendDto {
  week: number;
  current: number;
  previous: number;
}

export interface CityProfitDto {
  city: string;
  profit: number;
}

export interface YearlyCityProfitDto {
  year: number;
  cities: CityProfitDto[];
}

export interface BusinessHealthDto {
  isGrowing: boolean;
  growthPercent: number;
  avgCurrent: number;
  avgPrevious: number;
}

export interface DashboardDto {
  lastWeekSummary: LastWeekSummaryDto;
  monthlyComparison: MonthlyComparisonDto;
  yearlyProfitTrend: YearlyProfitTrendDto[];
  citiesProfit: YearlyCityProfitDto[];
  businessHealth: BusinessHealthDto;
}
