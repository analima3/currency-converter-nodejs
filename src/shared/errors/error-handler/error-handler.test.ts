import Fastify from "fastify"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { logger } from "../../../configs/logger.ts"
import { errorHandlerPlugin } from "../../../plugins/error-handler.ts"
import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { AppError } from "../app-error/app-error.ts"
import { errorHandler } from "./error-handler.ts"

function createMockReply() {
  const sendSpy = vi.fn()
  const statusSpy = vi.fn(() => ({ send: sendSpy }))

  return {
    reply: { status: statusSpy } as any,
    sendSpy,
    statusSpy,
  }
}

describe("errorHandler", () => {
  let logSpy: any

  beforeEach(() => {
    logSpy = vi.spyOn(logger, "error").mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should handle AppError and respond with its status and payload", () => {
    const error = new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Resource not found",
      statusCode: HttpStatus.NOT_FOUND,
    })

    const req: any = { method: "GET", url: "/test" }
    const { reply, sendSpy, statusSpy } = createMockReply()

    errorHandler(error, req, reply)

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.message,
        method: req.method,
        url: req.url,
      })
    )

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(sendSpy).toHaveBeenCalledWith({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    })
  })

  it("should handle validation errors and respond with BAD_REQUEST and validation message", () => {
    const validationError: any = {
      code: "FST_ERR_VALIDATION",
      validation: [{ instancePath: "/body/name", message: "Invalid field" }],
    }

    const req: any = { method: "POST", url: "/test" }
    const { reply, sendSpy, statusSpy } = createMockReply()

    errorHandler(validationError, req, reply)

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: validationError.validation[0].message,
        method: req.method,
        url: req.url,
      })
    )

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(sendSpy).toHaveBeenCalledWith({
      code: ErrorCode.VALIDATION_ERROR,
      description: validationError.validation[0].message,
      message: "Dados inválidos.",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  })

  it("should handle generic Error and respond with INTERNAL_SERVER_ERROR and log the application stack", () => {
    const error = new Error("Something bad happened")
    error.stack =
      "Error\n    at /Users/analima/Documents/projects/currency-converter-nodejs/src/foo.ts:10:5"

    const req: any = { method: "PUT", url: "/test" }
    const { reply, sendSpy, statusSpy } = createMockReply()

    errorHandler(error, req, reply)

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.message,
        method: req.method,
        source:
          "at /Users/analima/Documents/projects/currency-converter-nodejs/src/foo.ts:10:5",
        url: req.url,
      })
    )

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(sendSpy).toHaveBeenCalledWith({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Erro interno do servidor.",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  })

  it("should handle unknown non-error values and respond with INTERNAL_SERVER_ERROR", () => {
    const unknownError: any = null

    const req: any = { method: "DELETE", url: "/test" }
    const { reply, sendSpy, statusSpy } = createMockReply()

    errorHandler(unknownError, req, reply)

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unknown error",
        method: req.method,
        url: req.url,
      })
    )

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(sendSpy).toHaveBeenCalledWith({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Erro interno do servidor.",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  })
})

describe("errorHandler plugin integration", () => {
  function createApp() {
    const app = Fastify()
    errorHandlerPlugin(app)
    return app
  }

  it("should return the AppError payload when an AppError is thrown by a route", async () => {
    const app = createApp()

    app.get("/test-app-error", () => {
      throw new AppError({
        code: ErrorCode.NOT_FOUND,
        message: "Resource not found",
        statusCode: HttpStatus.NOT_FOUND,
      })
    })

    try {
      const response = await app.inject({
        method: "GET",
        url: "/test-app-error",
      })

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
      expect(response.json()).toEqual({
        code: ErrorCode.NOT_FOUND,
        message: "Resource not found",
        statusCode: HttpStatus.NOT_FOUND,
      })
    } finally {
      await app.close()
    }
  })

  it("should return BAD_REQUEST for Fastify validation errors thrown by a route", async () => {
    const app = createApp()

    app.get("/test-validation-error", () => {
      const error = new Error("Invalid payload") as Error & {
        code: "FST_ERR_VALIDATION"
        validation: Array<{ instancePath: string; message: string }>
      }

      error.code = "FST_ERR_VALIDATION"
      error.validation = [
        {
          instancePath: "/body/name",
          message: "Invalid field",
        },
      ]

      throw error
    })

    try {
      const response = await app.inject({
        method: "GET",
        url: "/test-validation-error",
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.json()).toEqual({
        code: ErrorCode.VALIDATION_ERROR,
        description: "Invalid field",
        message: "Dados inválidos.",
        statusCode: HttpStatus.BAD_REQUEST,
      })
    } finally {
      await app.close()
    }
  })

  it("should return INTERNAL_SERVER_ERROR for standard Error thrown by a route", async () => {
    const app = createApp()

    app.get("/test-unknown-error", () => {
      throw new Error("Unexpected failure")
    })

    try {
      const response = await app.inject({
        method: "GET",
        url: "/test-unknown-error",
      })

      expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(response.json()).toEqual({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Erro interno do servidor.",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    } finally {
      await app.close()
    }
  })
})
