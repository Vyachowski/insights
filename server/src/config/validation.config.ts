import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DB_URL: z.url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_MAX_AGE: z.coerce.number().int().positive().min(1000),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config);
}
