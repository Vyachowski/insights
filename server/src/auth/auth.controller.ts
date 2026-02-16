import type { Response } from 'express';

import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/auth.dto';
import { LocalAuthGuard } from '../common/guards/local.auth.guard';
import { User } from 'generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PrismaService } from '@/database/prisma.service';

type RequestWithUser = LoginRequestDto & { user: User };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('JWT_MAX_AGE'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, status, ...safeUser } = req.user;
    return { data: safeUser, message: 'Logged in successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: LoginRequestDto & { user: { userId: string } }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) throw new NotFoundException('User was not found.');

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
