import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class ExpenseResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ nullable: true }) siteId: number | null;
  @ApiProperty() date: Date;
  @ApiProperty({ type: Number })
  @Transform(({ value }) => (value != null ? Number(value) : null))
  amount: number;
  @ApiProperty() type: string;
  @ApiProperty({ nullable: true }) comment: string | null;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<ExpenseResponseDto>) {
    Object.assign(this, partial);
  }
}
