import * as z from "zod"

const EnvSchema = z
  .object({
    DB_CONTAINER: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_VOLUME: z.string().min(1),

    DB_PORT: z.coerce.number().int().positive(),

    DB_URL: z.string().url(),

    YANDEX_API_OAUTH_TOKEN: z.string().min(10),
  })
  .strip()

type EnvSchema = z.infer<typeof EnvSchema>

function parseEnv(env: NodeJS.ProcessEnv): EnvSchema {
  const parsed = EnvSchema.safeParse(env)

  if (!parsed.success) throw new Error("Env config files is not valid.")

  return parsed.data
}

export const env = parseEnv(process.env)
