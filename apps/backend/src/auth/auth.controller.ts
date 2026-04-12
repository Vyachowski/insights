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
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PrismaService } from '@/database/prisma.service';
import { User } from '@/prisma/generated/prisma/client';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { UserResponseDto } from './dto/user.dto';

type RequestWithUser = LoginRequestDto & { user: User };

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

    return new UserResponseDto(req.user);
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
  async getMe(@Request() req: LoginRequestDto & { user: { userId: string } }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) throw new NotFoundException('User was not found.');

    return new UserResponseDto(user);
  }
}