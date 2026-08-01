import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { jsonSchemaTransform } from "fastify-type-provider-zod"
import { swaggerConfig } from "../configs/swagger.ts"

export async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    ...swaggerConfig,
    transform: jsonSchemaTransform,
  })

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  })
}
