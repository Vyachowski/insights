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
}
