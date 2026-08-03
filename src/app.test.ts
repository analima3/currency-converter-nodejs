import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("./plugins/index.ts", () => ({
  registerPlugins: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("./modules/transaction/routes/transaction.routes.ts", () => ({
  transactionRoutes: vi.fn(),
}))

import { buildApp } from "./app.ts"
import { transactionRoutes } from "./modules/transaction/routes/transaction.routes.ts"
import { registerPlugins } from "./plugins/index.ts"

describe("buildApp", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should register plugins", async () => {
    await buildApp()

    expect(registerPlugins).toHaveBeenCalledTimes(1)
    expect(registerPlugins).toHaveBeenCalledWith(expect.any(Object), {})
  })

  it("should register transaction routes", async () => {
    await buildApp()

    expect(transactionRoutes).toHaveBeenCalledTimes(1)
    expect(transactionRoutes).toHaveBeenCalledWith(expect.any(Object), {
      prefix: "/transaction",
    })
  })

  it("should expose the health endpoint", async () => {
    vi.mocked(transactionRoutes).mockImplementation(() => undefined)
    vi.mocked(registerPlugins).mockResolvedValue(undefined)

    const app = await buildApp()

    const response = await app.inject({
      method: "GET",
      url: "/health",
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("OK")

    await app.close()
  })
})
