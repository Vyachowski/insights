import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_MAX_AGE: z.coerce.number().int().positive().min(1000),
  ALLOWED_ORIGIN: z.url(),
  PORT: z.coerce.number().int().positive(),
  DATABASE_CONNECT_RETRIES: z.coerce.number().int().positive().default(5),
  DATABASE_CONNECT_DELAY: z.coerce
    .number()
    .int()
    .positive()
    .gt(1000)
    .default(3000),
  // Startup bootstrap — each step is skipped when its vars are absent
  CITIES_CSV_URL: z.url().optional(),
  SITES_CSV_URL: z.url().optional(),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  ADMIN_NAME: z.string().optional(),
  ADMIN_LASTNAME: z.string().optional(),
  USER_EMAIL: z.email().optional(),
  USER_PASSWORD: z.string().min(1).optional(),
  USER_NAME: z.string().optional(),
  USER_LASTNAME: z.string().optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config);
}
