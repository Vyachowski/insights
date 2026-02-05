import { IsOptional, IsDateString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupBy, AnalyticsQuery } from '@shared/contracts/analytics.types';

export class AnalyticsQueryDto implements AnalyticsQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  siteId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy;
}
