import { z } from "zod"

const MONGO_URI_REGEX = /^mongodb(?:\+srv)?:\/\/.+/

const envSchema = z.object({
  APP_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",").map((url) => url.trim()))
    .pipe(z.array(z.string())),
  AWESOME_API_KEY: z.string().optional(),
  DB_MONGO_URI: z
    .string()
    .min(1)
    .refine((v) => MONGO_URI_REGEX.test(v), {
      message:
        "URI do MongoDB inválida. Deve começar com 'mongodb://' ou 'mongodb+srv://'",
    }),
  DB_NAME: z.string().default(""),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
})

export const env = envSchema.parse(process.env)

if (env.NODE_ENV === "production" && !env.AWESOME_API_KEY) {
  throw new Error(
    "A variável de ambiente 'AWESOME_API_KEY' é obrigatória em produção."
  )
}

if (!env.LOG_LEVEL) {
  env.LOG_LEVEL = env.NODE_ENV === "development" ? "debug" : "info"
}

export type Env = typeof env
