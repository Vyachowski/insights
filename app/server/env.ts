import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_PATH: z.string().min(1).default('./data/insights.db'),
  JWT_SECRET: z.string().min(1),
  // Milliseconds (legacy unit); convert to seconds for cookie maxAge
  JWT_MAX_AGE: z.coerce.number().int().positive().min(1000),
  PORT: z.coerce.number().int().positive().default(3000),
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
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)

export const sessionMaxAgeSeconds = Math.floor(env.JWT_MAX_AGE / 1000)
