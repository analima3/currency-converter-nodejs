import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { describe, expect, it, vi } from "vitest"

import { zodPlugin } from "./zod.ts"

describe("zodPlugin", () => {
  it("should register the validator and serializer compilers", () => {
    const setValidatorCompiler = vi.fn()
    const setSerializerCompiler = vi.fn()

    const app = {
      setSerializerCompiler,
      setValidatorCompiler,
    }

    zodPlugin(app as any)

    expect(setValidatorCompiler).toHaveBeenCalledTimes(1)
    expect(setValidatorCompiler).toHaveBeenCalledWith(validatorCompiler)

    expect(setSerializerCompiler).toHaveBeenCalledTimes(1)
    expect(setSerializerCompiler).toHaveBeenCalledWith(serializerCompiler)
  })
})
