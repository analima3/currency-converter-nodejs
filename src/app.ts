import Fastify from "fastify"
import cors from "@fastify/cors"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { env } from "./configs/env.ts"
import { logger } from './configs/logger.ts'

export const buildApp = () => {
    const app = Fastify({
      loggerInstance: logger,
    }).withTypeProvider<ZodTypeProvider>()

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    app.register(cors, {
      origin: env.APP_ALLOWED_ORIGINS,
    })

    app.get("/health", () => "OK")

    return app
}