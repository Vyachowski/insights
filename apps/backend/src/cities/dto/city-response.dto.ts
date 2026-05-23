import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CityResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() code: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiProperty() population: number;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<CityResponseDto>) {
    Object.assign(this, partial);
  }
}
