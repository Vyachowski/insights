import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string(),
    password: z.string(),
    role: RoleSchema,
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    status: UserStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
