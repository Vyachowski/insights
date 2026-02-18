export interface LastWeekSummary {
  weekStart: string;
  weekEnd: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MonthlyProfit {
  month: string;
  profit: number;
}

export interface MonthlyComparison {
  currentMonth: MonthlyProfit;
  lastYearSameMonth: MonthlyProfit;
  difference: number;
  percentage: number;
}

export interface YearlyProfitTrendPoint {
  week: number;
  current: number;
  previous: number;
}

export interface CityProfit {
  city: string;
  profit: number;
}

export interface YearlyCityProfit {
  year: number;
  cities: CityProfit[];
}

export interface BusinessHealth {
  isGrowing: boolean;
  growthPercent: number;
  avgCurrent: number;
  avgPrevious: number;
}

export interface DashboardResponse {
  lastWeekSummary: LastWeekSummary;
  monthlyComparison: MonthlyComparison;
  yearlyProfitTrend: YearlyProfitTrendPoint[];
  citiesProfit: YearlyCityProfit[];
  businessHealth: BusinessHealth;
}
