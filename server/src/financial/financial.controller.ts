import { Controller, Get } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get()
  getDashboard() {
    return this.financialService.getDashboard();
  }
}
