import { IsEmail, IsString, MinLength } from 'class-validator';
// import { LoginRequest, LoginResponse } from '@shared/contracts/auth.types';

// FIXME: Add shared types implementation
// export class LoginRequestDto implements LoginRequest {
export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}
// export class LoginResponseDto implements LoginResponse {
export class LoginResponseDto {
  access_token: string;
}
