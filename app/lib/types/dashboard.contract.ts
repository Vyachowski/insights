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
  monthlyCurrent: number;
  monthlyPrevious: number;
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

export interface MonthlyProfitPointDto {
  month: number; // 1..12
  current: number;
  previous: number;
}

export interface MonthlyProfitDto {
  months: MonthlyProfitPointDto[]; // always 12, Jan..Dec
  averageCurrent: number;
  averagePrevious: number;
  elapsedMonths: number;
}
