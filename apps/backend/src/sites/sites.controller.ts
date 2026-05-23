import { Controller, Get, NotFoundException, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { SiteResponseDto } from './dto/site-response.dto';

@ApiTags('Sites')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @ApiOperation({ summary: 'Get all sites' })
  @ApiWrappedResponse(SiteResponseDto, true)
  @Get()
  async findAll() {
    const sites = await this.sitesService.findAll();
    return sites.map((s) => new SiteResponseDto(s));
  }

  @ApiOperation({ summary: 'Get site by id' })
  @ApiWrappedResponse(SiteResponseDto)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const site = await this.sitesService.findOne(id);
    if (!site) throw new NotFoundException('Site not found.');
    return new SiteResponseDto(site);
  }
}
