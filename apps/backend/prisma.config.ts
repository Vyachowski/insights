import path from 'node:path';

import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const envName = process.env['NODE_ENV'] === 'production' ? '.env' : '.env.dev';

dotenv.config({ path: path.resolve(process.cwd(), envName) });

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
