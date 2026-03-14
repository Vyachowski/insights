import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.citiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.citiesService.findOne(id);
  }
}
