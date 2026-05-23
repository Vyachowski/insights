import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfitService } from './profit.service';

@ApiTags('Profit')
@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}
}
