import type { Response } from 'express';
import type { User } from '@/prisma/generated/prisma/client';

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
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PrismaService } from '@/database/prisma.service';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { UserResponseDto } from './dto/user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Login with email/password, sets access_token cookie' })
  @ApiBody({ type: LoginRequestDto })
  @ApiWrappedResponse(UserResponseDto)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = this.authService.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('JWT_MAX_AGE'),
    });

    return new UserResponseDto(user);
  }

  @ApiOperation({ summary: 'Logout, clears access_token cookie' })
  @ApiCookieAuth('access_token')
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

  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiCookieAuth('access_token')
  @ApiWrappedResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: { userId: string }) {
    const userData = await this.prismaService.user.findUnique({
      where: { id: user.userId },
    });

    if (!userData) throw new NotFoundException('User was not found.');

    return new UserResponseDto(userData);
  }
}
