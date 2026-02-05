import {
  Controller,
  Get,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginRequestDto } from './auth/dto/auth.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: LoginRequestDto & { user: { userId: string } },
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) throw new NotFoundException('User was not found.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
