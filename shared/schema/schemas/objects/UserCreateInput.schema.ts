import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RoleSchema } from '../enums/Role.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  role: RoleSchema.optional(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  status: UserStatusSchema.optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
