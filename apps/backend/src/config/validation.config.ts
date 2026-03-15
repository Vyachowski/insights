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
  YANDEX_API_OAUTH_TOKEN: z.string(),
  DATABASE_CONNECT_RETRIES: z.coerce.number().int().positive().default(5),
  DATABASE_CONNECT_DELAY: z.coerce
    .number()
    .int()
    .positive()
    .gt(1000)
    .default(3000),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config);
}
