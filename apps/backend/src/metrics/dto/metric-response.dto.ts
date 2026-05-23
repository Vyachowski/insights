import { ApiProperty } from '@nestjs/swagger';

export class MetricResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() siteId: number;
  @ApiProperty() date: Date;
  @ApiProperty() yandexUsers: number;
  @ApiProperty() googleUsers: number;
  @ApiProperty() otherUsers: number;
  @ApiProperty() visitDurationYandexInSec: number;
  @ApiProperty() visitDurationGoogleInSec: number;
  @ApiProperty() visitDurationOtherInSec: number;
  @ApiProperty() bounceYandex: number;
  @ApiProperty() bounceGoogle: number;
  @ApiProperty() bounceOther: number;
  @ApiProperty() leadsYandex: number;
  @ApiProperty() leadsGoogle: number;
  @ApiProperty() leadsOther: number;

  constructor(partial: Partial<MetricResponseDto>) {
    Object.assign(this, partial);
  }
}
