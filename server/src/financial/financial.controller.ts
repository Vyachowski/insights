import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard() {
    return this.financialService.getDashboard();
  }
}
