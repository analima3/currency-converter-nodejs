import FastifyCors from "@fastify/cors"
import type { FastifyInstance } from "fastify"
import { env } from "../../configs/env.ts"

export async function corsPlugin(app: FastifyInstance) {
  console.log("corsPlugin env.APP_ALLOWED_ORIGINS=", env.APP_ALLOWED_ORIGINS)
  await app.register(FastifyCors, {
    origin: env.APP_ALLOWED_ORIGINS,
  })
}
