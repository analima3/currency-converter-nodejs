import Fastify from "fastify"
import { type ZodTypeProvider } from "fastify-type-provider-zod"

import { logger } from './configs/logger.ts'

import { registerPlugins } from "./plugins/index.plugin.ts"

export const buildApp = async () => {
    const app = Fastify({
      loggerInstance: logger,
    }).withTypeProvider<ZodTypeProvider>()

    await app.register(registerPlugins)

    app.get("/health", () => "OK")

    return app
}