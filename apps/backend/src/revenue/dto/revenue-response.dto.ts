import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RevenueDto } from '@insights/contracts';

export class RevenueResponseDto implements RevenueDto {
  @ApiProperty() id: number;
  @ApiProperty({ nullable: true }) siteId: number | null;
  @ApiProperty() date: Date;
  @ApiProperty({ type: Number }) amount: number;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(data: Record<string, unknown>) {
    Object.assign(this, data);
    if (data.amount != null) this.amount = Number(data.amount);
  }
}
