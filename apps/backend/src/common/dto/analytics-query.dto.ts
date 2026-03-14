import { IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
// import { AnalyticsQuery } from '@shared/contracts/analytics.types';

// FIXME: Add shared types implementation
// export class AnalyticsQueryDto implements AnalyticsQuery {
export class AnalyticsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  siteId?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
