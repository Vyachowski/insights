import { RoleSchema } from '@shared/schema/schemas';
import * as argon2 from 'argon2';

export async function createUsers() {
  const adminPassword = await argon2.hash(process.env.ADMIN_PASSWORD!);
  const userPassword = await argon2.hash(process.env.USER_PASSWORD!);

  return [
    {
      email: process.env.ADMIN_EMAIL!,
      password: adminPassword,
      firstName: process.env.ADMIN_NAME,
      lastName: process.env.ADMIN_LASTNAME,
      role: RoleSchema.enum.ADMIN,
    },
    {
      email: process.env.USER_EMAIL!,
      password: userPassword,
      firstName: process.env.USER_NAME,
      lastName: process.env.USER_LASTNAME,
      role: RoleSchema.enum.USER,
    },
  ];
}
