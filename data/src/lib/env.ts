import "dotenv/config"
import * as z from "zod"

const EnvSchema = z
  .object({
    YANDEX_API_OAUTH_TOKEN: z.string().min(10),
  })
  .strip()

type EnvSchema = z.infer<typeof EnvSchema>

function parseEnv(env: NodeJS.ProcessEnv): EnvSchema {
  return EnvSchema.parse(env)
}

export const env = parseEnv(process.env)
