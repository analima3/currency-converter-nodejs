import { describe, expect, it, vi } from "vitest"
import { errorHandler } from "../../shared/errors/error-handler/error-handler.ts"
import { errorHandlerPlugin } from "./error-handler.ts"

vi.mock("../../shared/errors/error-handler/error-handler.ts", () => ({
  errorHandler: vi.fn(),
}))

describe("errorHandlerPlugin", () => {
  it("should register the error handler", () => {
    const setErrorHandler = vi.fn()

    const app = {
      setErrorHandler,
    }

    errorHandlerPlugin(app as any)

    expect(setErrorHandler).toHaveBeenCalledTimes(1)
    expect(setErrorHandler).toHaveBeenCalledWith(expect.any(Function))
  })

  it("should delegate errors to errorHandler", () => {
    const setErrorHandler = vi.fn()

    const app = {
      setErrorHandler,
    }

    errorHandlerPlugin(app as any)

    const [[handler]] = setErrorHandler.mock.calls

    const error = new Error("boom")
    const request = {}
    const reply = {}

    handler(error, request, reply)

    expect(errorHandler).toHaveBeenCalledWith(error, request, reply)
  })
})
