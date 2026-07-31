import { FastifyPluginAsync } from 'fastify'

import { registerCors } from './cors.ts'
import { registerZod } from './zod.ts'

export const registerPlugins: FastifyPluginAsync = async (app) => {
  await app.register(registerZod)
  await app.register(registerCors)
}
