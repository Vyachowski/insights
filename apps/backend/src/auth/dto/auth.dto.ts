import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginDto } from '@insights/contracts';

export class LoginRequestDto implements LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}
