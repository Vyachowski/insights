import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ImportUrlDto {
  @ApiProperty({ example: 'https://example.com/data.csv' })
  @IsUrl()
  url: string;
}
