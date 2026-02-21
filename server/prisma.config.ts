import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: ['../.env.dev', '../.env'] });

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: 'npx tsx ./src/prisma/seed/seed.ts',
  },
  datasource: {
    url: process.env['DB_URL'],
  },
});
