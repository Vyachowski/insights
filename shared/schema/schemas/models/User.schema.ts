import * as z from 'zod';
import { RoleSchema } from '../enums/Role.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  role: RoleSchema.default("USER"),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  status: UserStatusSchema.default("ACTIVE"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
