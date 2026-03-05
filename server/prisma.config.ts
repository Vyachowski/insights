import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const envName = process.env['NODE_ENV'] === 'production' ? '.env' : '.env.dev';

dotenv.config({ path: `../${envName}` });

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
