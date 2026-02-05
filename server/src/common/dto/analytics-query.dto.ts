import { IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsQuery } from '@shared/contracts/analytics.types';

export class AnalyticsQueryDto implements AnalyticsQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  city_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  site_id?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
