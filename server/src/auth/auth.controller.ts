import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  getProfile() {
    // TODO: добавим после guards
    // Будет возвращать профиль текущего юзера
  }

  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }
}
