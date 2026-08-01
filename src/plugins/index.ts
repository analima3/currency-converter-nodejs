import type { FastifyPluginAsync } from "fastify"

import { corsPlugin } from "./cors.ts"
import { errorHandlerPlugin } from "./error-handler.ts"
import { swaggerPlugin } from "./swagger.ts"
import { zodPlugin } from "./zod.ts"

export const registerPlugins: FastifyPluginAsync = async (app) => {
  errorHandlerPlugin(app)
  zodPlugin(app)

  await corsPlugin(app)
  await swaggerPlugin(app)
}
