import {
  createUsers,
  getSeedUsersConfig,
  hashPasswords,
} from '../creators/users';
import { seedUsers } from '../seeders';

export async function importUsers() {
  const config = getSeedUsersConfig();
  const passwords = await hashPasswords(config);
  const users = createUsers(config, passwords);

  await seedUsers(users);
}
