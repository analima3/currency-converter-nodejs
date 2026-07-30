import { fastifyCors } from "@fastify/cors"
import { fastify } from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { env } from "./configs/env.ts"
import { logger } from './configs/logger.ts'

const app = fastify({
  logger,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: env.APP_ALLOWED_ORIGINS,
})

app.get("/health", () => "OK")

app.listen({ port: env.PORT })
