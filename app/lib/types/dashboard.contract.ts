export interface MetricComparisonDto {
  current: number;
  previous: number;
}

export interface VerdictDto {
  isGrowing: boolean;
  isStrong: boolean;
  growthPercent: number;
  current: number;
  previous: number;
}

export interface TrendsDto {
  calls: MetricComparisonDto;
  revenue: MetricComparisonDto;
  expenses: MetricComparisonDto;
}

export interface CityCallsDto {
  city: string;
  current: number;
  previous: number;
}

export interface MonthlyRevenuePointDto {
  month: number; // 1..12
  current: number;
  previous: number;
}

export interface MonthlyRevenueDto {
  months: MonthlyRevenuePointDto[]; // always 12, Jan..Dec
  averageCurrent: number;
  averagePrevious: number;
  elapsedMonths: number;
}
