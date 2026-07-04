import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SiteDto } from '@insights/contracts';

export class SiteResponseDto implements SiteDto {
  @ApiProperty() id: number;
  @ApiProperty() cityId: number;
  @ApiProperty({ nullable: true }) name: string | null;
  @ApiProperty({ nullable: true }) group: string | null;
  @ApiProperty() url: string;
  @ApiProperty() yandexCounterId: string;
  @ApiProperty({ nullable: true }) googleCounterId: string | null;
  @ApiProperty({ nullable: true }) yandexTagManagerId: string | null;
  @ApiProperty({ nullable: true }) googleTagManagerId: string | null;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<SiteResponseDto>) {
    Object.assign(this, partial);
  }
}
