import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CallImportDto } from '@insights/contracts';

export class CallImportResponseDto implements CallImportDto {
  @ApiProperty() id: number;
  @ApiProperty() siteId: number;
  @ApiProperty() date: Date;
  @ApiProperty() src: string;
  @ApiPropertyOptional() region: string | null;
  @ApiProperty() callNumber: number;
  @ApiPropertyOptional() class: string | null;
  @ApiProperty() projectTitle: string;
  @ApiProperty() advChannelName: string;
  @ApiProperty() billsec: number;
  @ApiPropertyOptional() comment: string | null;
  @ApiPropertyOptional() redirectNumber: string | null;
  @ApiProperty() source: string;

  @Exclude() importedAt: Date;

  constructor(partial: Partial<CallImportResponseDto>) {
    Object.assign(this, partial);
  }
}
