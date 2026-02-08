import * as z from 'zod';

export const UserStatusSchema = z.enum(['ACTIVE', 'DEACTIVATED'])

export type UserStatus = z.infer<typeof UserStatusSchema>;