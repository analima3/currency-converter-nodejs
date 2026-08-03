import Fastify from "fastify"
import { describe, expect, it, vi } from "vitest"

vi.mock("../../configs/env.ts", () => ({
  env: {
    APP_ALLOWED_ORIGINS: ["http://localhost:3000"],
  },
}))

import { corsPlugin } from "./cors.ts"

describe("corsPlugin", () => {
  it("should register the cors plugin", async () => {
    const app = Fastify()
    const spy = vi.spyOn(app, "register")

    await corsPlugin(app)

    expect(spy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        origin: ["http://localhost:3000"],
      })
    )
  })
})
