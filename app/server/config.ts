import { z } from 'zod'

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_PATH: z.string().min(1).default('./data/insights.db'),
  JWT_SECRET: z.string().min(1),
  // Milliseconds (legacy unit); convert to seconds for cookie maxAge
  JWT_MAX_AGE: z.coerce.number().int().positive().min(1000),
  PORT: z.coerce.number().int().positive().default(3000),
  // Bucket storage (S3-compatible) — optional; storage features activate
  // only when all four are present
  BUCKET_ENDPOINT: z.url().optional(),
  BUCKET_NAME: z.string().min(1).optional(),
  BUCKET_ACCESS_KEY_ID: z.string().min(1).optional(),
  BUCKET_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  BUCKET_REGION: z.string().min(1).default('auto'),
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
  // Shared secret for the Gudok call webhook. Sent in the URL path
  // (/webhooks/gudok/<secret>); the endpoint is disabled when unset
  GUDOK_WEBHOOK_SECRET: z.string().min(1).optional(),
  // Set by Railway; shown by the health endpoint. No min(1): an empty value
  // must not stop the app from starting
  RAILWAY_GIT_COMMIT_SHA: z.string().optional(),
})

type Config = z.infer<typeof configSchema>

export const config: Config = configSchema.parse(process.env)

export const sessionMaxAgeSeconds = Math.floor(config.JWT_MAX_AGE / 1000)

export function isStorageConfigured(): boolean {
  return Boolean(
    config.BUCKET_ENDPOINT
    && config.BUCKET_NAME
    && config.BUCKET_ACCESS_KEY_ID
    && config.BUCKET_SECRET_ACCESS_KEY,
  )
}
