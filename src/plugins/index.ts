import type { FastifyPluginAsync } from "fastify"

import { corsPlugin } from "./cors.ts"
import { errorHandlerPlugin } from "./error-handler.ts"
import { zodPlugin } from "./zod.ts"

export const registerPlugins: FastifyPluginAsync = async (app) => {
  errorHandlerPlugin(app)
  await corsPlugin(app)
  await zodPlugin(app)
}
