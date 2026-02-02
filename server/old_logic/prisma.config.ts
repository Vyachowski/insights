import "dotenv/config";
import { defineConfig } from "prisma/config";

const { DB_URL } = process.env;

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "tsx src/prisma/seed/seed.ts"
  },
  datasource: {
    url: DB_URL,
  },
});
