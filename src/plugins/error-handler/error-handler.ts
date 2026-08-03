import type { FastifyInstance } from "fastify"
import { errorHandler } from "../../shared/errors/error-handler/error-handler.ts"

export function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) =>
    errorHandler(error, _request, reply)
  )
}
