import { FastifyInstance } from 'fastify'

import { registerCors } from './cors.plugin.ts'
import { registerZod } from './zod.plugin.ts'

export async function registerPlugins(app: FastifyInstance) {
  await app.register(registerZod)
  await app.register(registerCors)
}
