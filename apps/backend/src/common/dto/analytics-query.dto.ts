import { IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsQueryDto as IAnalyticsQueryDto } from '@insights/contracts';

export class AnalyticsQueryDto implements IAnalyticsQueryDto {
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
}
