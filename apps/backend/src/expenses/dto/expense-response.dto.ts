import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ExpenseDto } from '@insights/contracts';

export class ExpenseResponseDto implements ExpenseDto {
  @ApiProperty() id: number;
  @ApiProperty({ nullable: true }) siteId: number | null;
  @ApiProperty() date: Date;
  @ApiProperty({ type: Number }) amount: number;
  @ApiProperty() type: string;
  @ApiProperty({ nullable: true }) comment: string | null;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(data: Record<string, unknown>) {
    Object.assign(this, data);
    if (data.amount != null) this.amount = Number(data.amount);
  }
}
