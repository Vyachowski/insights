import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginRequest, LoginResponse } from '@shared/contracts/auth.types';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}

export class LoginResponseDto implements LoginResponse {
  accessToken: string;
}
