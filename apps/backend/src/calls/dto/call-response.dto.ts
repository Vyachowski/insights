import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CallResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() siteId: number;
  @ApiProperty() gudokId: number;
  @ApiProperty() projectId: number;
  @ApiProperty() projectTitle: string;
  @ApiProperty() dst: string;
  @ApiProperty() advChannelId: string;
  @ApiProperty() advChannelName: string;
  @ApiProperty() src: string;
  @ApiProperty() duration: number;
  @ApiProperty() billsec: number;
  @ApiProperty() callstatus: string;
  @ApiProperty() date: Date;
  @ApiProperty() region: string;
  @ApiProperty() callNumber: number;
  @ApiProperty() audio: string;
  @ApiProperty() source: string;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<CallResponseDto>) {
    Object.assign(this, partial);
  }
}
