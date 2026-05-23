import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { CityResponseDto } from './dto/city-response.dto';

@ApiTags('Cities')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @ApiWrappedResponse(CityResponseDto, true)
  @Get()
  async findAll() {
    const cities = await this.citiesService.findAll();
    return cities.map((c) => new CityResponseDto(c));
  }

  @ApiOperation({ summary: 'Get city by id' })
  @ApiWrappedResponse(CityResponseDto)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const city = await this.citiesService.findOne(id);
    if (!city) throw new NotFoundException('City not found.');
    return new CityResponseDto(city);
  }
}
