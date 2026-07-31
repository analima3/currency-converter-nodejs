import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import FastifyCors from '@fastify/cors'
import { env } from '../configs/env.ts'

export async function registerCors(app: FastifyInstance) {
  await app.register(FastifyCors, {
    origin: env.APP_ALLOWED_ORIGINS,
  })
}
