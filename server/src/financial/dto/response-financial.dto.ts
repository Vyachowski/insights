import {
  IsArray,
  // IsBoolean,
  IsInt,
  IsISO8601,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class WeeklyProfitPointDto {
  @IsInt()
  readonly week: number;

  @IsNumber()
  readonly profit: number;
}

export class YearlyTrendDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyProfitPointDto)
  readonly currentYear: WeeklyProfitPointDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyProfitPointDto)
  readonly lastYear: WeeklyProfitPointDto[];
}

export class CityProfitDto {
  @IsString()
  readonly city: string;

  @IsNumber()
  readonly profit: number;
}

export class CitiesProfitDto {
  @IsInt()
  readonly year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CityProfitDto)
  readonly cities: CityProfitDto[];
}

// export class BusinessHealthDto {
//   @IsBoolean()
//   readonly isGrowing: boolean;

//   @IsNumber()
//   readonly growthPercent: number;

//   @IsNumber()
//   readonly avgCurrent: number;

//   @IsNumber()
//   readonly avgPrevious: number;
// }

export class ResponseFinancialDto {
  @ValidateNested()
  @Type(() => LastWeekSummaryDto)
  readonly lastWeekSummary: LastWeekSummaryDto;

  @ValidateNested()
  @Type(() => MonthlyComparisonDto)
  readonly monthlyComparison: MonthlyComparisonDto;

  @ValidateNested()
  @Type(() => YearlyTrendDto)
  readonly yearlyTrend: YearlyTrendDto;

  @ValidateNested()
  @Type(() => CitiesProfitDto)
  readonly citiesProfit: CitiesProfitDto;

  // @ValidateNested()
  // @Type(() => BusinessHealthDto)
  // readonly businessHealth: BusinessHealthDto;
}
