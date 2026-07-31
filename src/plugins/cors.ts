import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import { env } from '../configs/env.ts'

export const registerCors: FastifyPluginAsync = async (app) => {
  await app.register(cors, {
    origin: env.APP_ALLOWED_ORIGINS,
  })
}