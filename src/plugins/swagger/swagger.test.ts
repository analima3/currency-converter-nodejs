import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { jsonSchemaTransform } from "fastify-type-provider-zod"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { swaggerConfig } from "../../configs/swagger.ts"
import { swaggerPlugin } from "./swagger.ts"

describe("swaggerPlugin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should register swagger and swagger-ui plugins", async () => {
    const register = vi.fn().mockResolvedValue(undefined)

    const app = {
      register,
    }

    await swaggerPlugin(app as any)

    expect(register).toHaveBeenCalledTimes(2)

    expect(register).toHaveBeenNthCalledWith(1, swagger, {
      ...swaggerConfig,
      transform: jsonSchemaTransform,
    })

    expect(register).toHaveBeenNthCalledWith(2, swaggerUi, {
      routePrefix: "/docs",
    })
  })
})
