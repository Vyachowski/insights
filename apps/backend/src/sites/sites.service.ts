import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SitesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.site.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.site.findUnique({ where: { id } });
  }

  async getActiveSitesWithCities(startDate: Date, endDate: Date) {
    return await this.prismaService.site.findMany({
      where: {
        callsImport: {
          some: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      include: {
        city: true,
      },
    });
  }
}
