import type { Role, UserStatus } from '@/prisma/generated/schemas';
import { User } from '@insights/contracts';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isAdmin: boolean;
  isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  role: Role;

  @ApiHideProperty()
  @Exclude()
  status: UserStatus;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
