import type { FastifyInstance } from 'fastify'

import { corsPlugin } from './cors.ts'
import { zodPlugin } from './zod.ts'
import { errorHandlerPlugin } from './error-handler.ts'

export async function registerPlugins(app: FastifyInstance) {
  await app.register(zodPlugin)
  await app.register(corsPlugin)
  await app.register(errorHandlerPlugin)
}
