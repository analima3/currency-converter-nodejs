import Fastify, { type FastifyBaseLogger } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

import { logger } from "./configs/logger.ts"

import { registerPlugins } from "./plugins/index.ts"

export const buildApp = async () => {
  const app = Fastify({
    loggerInstance: logger as FastifyBaseLogger,
  }).withTypeProvider<ZodTypeProvider>()

  await registerPlugins(app, {})

  app.get("/health", () => "OK")

  return app
}
