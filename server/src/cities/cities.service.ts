import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.city.findMany();
  }

  findOne(id: number) {
    return this.prismaService.city.findUnique({ where: { id } });
  }
}
