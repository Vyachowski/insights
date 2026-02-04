import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly PrismaService: PrismaService) {}

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.PrismaService.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. TODO: Генерация JWT токена (следующий шаг)

    return {
      token: '',
      user,
    };
  }
}
