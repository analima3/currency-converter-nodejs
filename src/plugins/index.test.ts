import Fastify from "fastify"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { env } from "../configs/env.ts"

describe("registerPlugins unit", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should register plugins in the expected order", async () => {
    const callOrder: string[] = []

    const errorHandlerPlugin = vi.fn((_app): void => {
      callOrder.push("errorHandler")
    })

    const zodPlugin = vi.fn((_app): void => {
      callOrder.push("zod")
    })

    const corsPlugin = vi.fn((_app): Promise<void> => {
      callOrder.push("cors")
      return Promise.resolve()
    })

    const swaggerPlugin = vi.fn((_app): Promise<void> => {
      callOrder.push("swagger")
      return Promise.resolve()
    })

    vi.doMock("./error-handler/error-handler.ts", () => ({
      errorHandlerPlugin,
    }))
    vi.doMock("./zod/zod.ts", () => ({ zodPlugin }))
    vi.doMock("./cors/cors.ts", () => ({ corsPlugin }))
    vi.doMock("./swagger/swagger.ts", () => ({ swaggerPlugin }))

    const { registerPlugins } = await import("./index.ts")
    const app = {} as any

    await registerPlugins(app, {} as any)

    expect(errorHandlerPlugin).toHaveBeenCalledOnce()
    expect(zodPlugin).toHaveBeenCalledOnce()
    expect(corsPlugin).toHaveBeenCalledOnce()
    expect(swaggerPlugin).toHaveBeenCalledOnce()
    expect(errorHandlerPlugin.mock.calls[0][0]).toBe(app)
    expect(zodPlugin.mock.calls[0][0]).toBe(app)
    expect(corsPlugin.mock.calls[0][0]).toBe(app)
    expect(swaggerPlugin.mock.calls[0][0]).toBe(app)
    expect(callOrder).toEqual(["errorHandler", "zod", "cors", "swagger"])
  })
})

describe("registerPlugins integration", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.doUnmock("./error-handler/error-handler.ts")
    vi.doUnmock("./zod/zod.ts")
    vi.doUnmock("./cors/cors.ts")
    vi.doUnmock("./swagger/swagger.ts")
  })

  it("should register CORS and Swagger UI routes without throwing", async () => {
    const app = Fastify()
    const { registerPlugins } = await import("./index.ts")

    await registerPlugins(app, {} as any)

    app.get("/health", () => "OK")

    await app.ready()

    const response = await app.inject({
      headers: {
        origin: env.APP_ALLOWED_ORIGINS[0],
      },
      method: "GET",
      url: "/health",
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("OK")
    expect(response.headers["access-control-allow-origin"]).toBe(
      env.APP_ALLOWED_ORIGINS[0]
    )

    const docsResponse = await app.inject({
      method: "GET",
      url: "/docs/",
    })

    expect([200, 301, 302]).toContain(docsResponse.statusCode)
    expect(docsResponse.statusCode).not.toBe(500)

    await app.close()
  })
})
