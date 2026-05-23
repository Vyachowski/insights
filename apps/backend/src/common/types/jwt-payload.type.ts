import type { Role } from '@/prisma/generated/schemas';

export type JwtPayload = {
  userId: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
};
