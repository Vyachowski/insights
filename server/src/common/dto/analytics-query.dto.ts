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

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
