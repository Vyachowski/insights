import {
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
// import type {
//   BusinessHealth,
//   CityProfit,
//   DashboardResponse,
//   LastWeekSummary,
//   MonthlyComparison,
//   YearlyCityProfit,
//   YearlyProfitTrendPoint,
// } from '@contracts/dashboard.contract';

// FIXME: Add shared types implementation
// export class LastWeekSummaryDto implements LastWeekSummary {
export class LastWeekSummaryDto {
  @IsISO8601()
  readonly weekStart: string;

  @IsISO8601()
  readonly weekEnd: string;

  @IsNumber()
  readonly revenue: number;

  @IsNumber()
  readonly expenses: number;

  @IsNumber()
  readonly profit: number;
}

export class MonthlyProfitDto {
  @IsISO8601()
  readonly month: string;

  @IsNumber()
  readonly profit: number;
}

// export class MonthlyComparisonDto implements MonthlyComparison {
export class MonthlyComparisonDto {
  @ValidateNested()
  @Type(() => MonthlyProfitDto)
  readonly currentMonth: MonthlyProfitDto;

  @ValidateNested()
  @Type(() => MonthlyProfitDto)
  readonly lastYearSameMonth: MonthlyProfitDto;

  @IsNumber()
  readonly difference: number;

  @IsNumber()
  readonly percentage: number;
}

// export class YearlyProfitTrendPointDto implements YearlyProfitTrendPoint {
export class YearlyProfitTrendPointDto {
  @IsInt()
  readonly week: number;

  @IsNumber()
  readonly current: number;

  @IsNumber()
  readonly previous: number;
}

// export class CityProfitDto implements CityProfit {
export class CityProfitDto {
  @IsString()
  readonly city: string;

  @IsNumber()
  readonly profit: number;
}

// export class YearlyCityProfitDto implements YearlyCityProfit {
export class YearlyCityProfitDto {
  @IsInt()
  readonly year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CityProfitDto)
  readonly cities: CityProfitDto[];
}

// export class BusinessHealthDto implements BusinessHealth {
export class BusinessHealthDto {
  @IsBoolean()
  readonly isGrowing: boolean;

  @IsNumber()
  readonly growthPercent: number;

  @IsNumber()
  readonly avgCurrent: number;

  @IsNumber()
  readonly avgPrevious: number;
}

// export class DashboardResponseDto implements DashboardResponse {
export class DashboardResponseDto {
  @ValidateNested()
  @Type(() => LastWeekSummaryDto)
  readonly lastWeekSummary: LastWeekSummaryDto;

  @ValidateNested()
  @Type(() => MonthlyComparisonDto)
  readonly monthlyComparison: MonthlyComparisonDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => YearlyProfitTrendPointDto)
  readonly yearlyProfitTrend: YearlyProfitTrendPointDto[];

  @ValidateNested()
  @Type(() => YearlyCityProfitDto)
  readonly citiesProfit: YearlyCityProfitDto[];

  @ValidateNested()
  @Type(() => BusinessHealthDto)
  readonly businessHealth: BusinessHealthDto;
}
