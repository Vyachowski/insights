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
