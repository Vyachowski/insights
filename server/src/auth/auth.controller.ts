import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local.auth.guard';
import { User } from 'generated/prisma/client';

type RequestWithUser = LoginRequestDto & { user: User };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}
