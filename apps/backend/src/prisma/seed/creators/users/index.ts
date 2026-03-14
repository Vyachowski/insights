import { RoleSchema } from '@/prisma/generated/schemas';
import { getSeedUsersConfig } from './helpers/get-seed-users-config';
import { hashPasswords } from './helpers/hash-passwords';

function createUsers(
  config: ReturnType<typeof getSeedUsersConfig>,
  passwords: Awaited<ReturnType<typeof hashPasswords>>,
) {
  return {
    admin: {
      email: config.admin.email,
      password: passwords.adminPassword,
      firstName: config.admin.firstName,
      lastName: config.admin.lastName,
      role: RoleSchema.enum.ADMIN,
    },
    user: {
      email: config.user.email,
      password: passwords.userPassword,
      firstName: config.user.firstName,
      lastName: config.user.lastName,
      role: RoleSchema.enum.USER,
    },
  };
}

export { createUsers, getSeedUsersConfig, hashPasswords };
