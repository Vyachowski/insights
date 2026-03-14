import type { getSeedUsersConfig } from './get-seed-users-config';
import * as argon2 from 'argon2';

export async function hashPasswords(
  config: ReturnType<typeof getSeedUsersConfig>,
) {
  return {
    adminPassword: await argon2.hash(config.admin.password),
    userPassword: await argon2.hash(config.user.password),
  };
}
