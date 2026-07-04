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
import type {
  BusinessHealthDto as IBusinessHealthDto,
  CityProfitDto as ICityProfitDto,
  DashboardDto as IDashboardDto,
  LastWeekSummaryDto as ILastWeekSummaryDto,
  MonthlyComparisonDto as IMonthlyComparisonDto,
  MonthlyProfitDto as IMonthlyProfitDto,
  YearlyCityProfitDto as IYearlyCityProfitDto,
  YearlyProfitTrendDto as IYearlyProfitTrendDto,
} from '@insights/contracts';

export class LastWeekSummaryDto implements ILastWeekSummaryDto {
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

class MonthlyProfitDto implements IMonthlyProfitDto {
  @IsISO8601()
  readonly month: string;

  @IsNumber()
  readonly profit: number;
}

export class MonthlyComparisonDto implements IMonthlyComparisonDto {
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

export class YearlyProfitTrendPointDto implements IYearlyProfitTrendDto {
  @IsInt()
  readonly week: number;

  @IsNumber()
  readonly current: number;

  @IsNumber()
  readonly previous: number;
}

class CityProfitDto implements ICityProfitDto {
  @IsString()
  readonly city: string;

  @IsNumber()
  readonly profit: number;
}

class YearlyCityProfitDto implements IYearlyCityProfitDto {
  @IsInt()
  readonly year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CityProfitDto)
  readonly cities: CityProfitDto[];
}

class BusinessHealthDto implements IBusinessHealthDto {
  @IsBoolean()
  readonly isGrowing: boolean;

  @IsNumber()
  readonly growthPercent: number;

  @IsNumber()
  readonly avgCurrent: number;

  @IsNumber()
  readonly avgPrevious: number;
}

export class DashboardResponseDto implements IDashboardDto {
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
