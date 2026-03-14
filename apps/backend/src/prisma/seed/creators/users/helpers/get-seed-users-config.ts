export function getSeedUsersConfig() {
  return {
    admin: {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      firstName: process.env.ADMIN_NAME!,
      lastName: process.env.ADMIN_LASTNAME!,
    },
    user: {
      email: process.env.USER_EMAIL!,
      password: process.env.USER_PASSWORD!,
      firstName: process.env.USER_NAME!,
      lastName: process.env.USER_LASTNAME!,
    },
  };
}
