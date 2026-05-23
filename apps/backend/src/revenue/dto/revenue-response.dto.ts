import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class RevenueResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ nullable: true }) siteId: number | null;
  @ApiProperty() date: Date;
  @ApiProperty({ type: Number })
  @Transform(({ value }) => (value != null ? Number(value) : null))
  amount: number;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<RevenueResponseDto>) {
    Object.assign(this, partial);
  }
}
