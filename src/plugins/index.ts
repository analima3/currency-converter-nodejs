import type { FastifyPluginAsync } from "fastify"

import { corsPlugin } from "./cors/cors.ts"
import { errorHandlerPlugin } from "./error-handler/error-handler.ts"
import { swaggerPlugin } from "./swagger/swagger.ts"
import { zodPlugin } from "./zod/zod.ts"

export const registerPlugins: FastifyPluginAsync = async (app) => {
  errorHandlerPlugin(app)
  zodPlugin(app)

  await corsPlugin(app)
  await swaggerPlugin(app)
}
