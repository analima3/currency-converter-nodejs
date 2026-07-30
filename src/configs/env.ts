import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .optional(),
  APP_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",").map((url) => url.trim()))
    .pipe(z.array(z.string())),
  AWESOME_API_KEY: z.string().optional(),
  PORT: z.coerce.number().default(3001),
  DB_NAME: z.string().default(""),
  DB_MONGO_URI: z
    .string()
    .min(1)
    .refine((v) => /^mongodb(?:\+srv)?:\/\/.+/.test(v), { message: "Invalid MONGO_URI" })
})

export const env = envSchema.parse(process.env)

if (env.NODE_ENV === "production" && !env.AWESOME_API_KEY) {
  throw new Error("AWESOME_API_KEY must be set in production")
}

if (!env.LOG_LEVEL) {
  env.LOG_LEVEL = env.NODE_ENV === "development" ? "debug" : "info"
}

export type Env = typeof env
