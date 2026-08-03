import Fastify from "fastify"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorCode } from "../../utils/constants/error-codes.constants.ts"
import { HttpStatus } from "../../utils/constants/http-status.constants.ts"
import { isValidationError, type ValidationError } from "./validation-error.ts"

const originalEnv = {
  AWESOME_API_KEY: process.env.AWESOME_API_KEY,
  AWESOME_API_URL: process.env.AWESOME_API_URL,
  DB_MONGO_URI: process.env.DB_MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL,
  NODE_ENV: process.env.NODE_ENV,
}

describe("isValidationError utility", () => {
  it("should return true for a validation error with the correct shape", () => {
    const error: ValidationError = {
      code: "FST_ERR_VALIDATION",
      validation: [
        {
          instancePath: "/name",
          message: "Campo obrigatório.",
        },
      ],
    }

    expect(isValidationError(error)).toBe(true)
  })

  it("should return false for null values", () => {
    expect(isValidationError(null)).toBe(false)
  })

  it("should return false for objects with an invalid code", () => {
    const error = {
      code: "OTHER_ERROR",
      validation: [
        {
          instancePath: "/value",
          message: "Erro.",
        },
      ],
    }

    expect(isValidationError(error)).toBe(false)
  })

  it("should return false when validation is not an array", () => {
    const error = {
      code: "FST_ERR_VALIDATION",
      validation: {
        instancePath: "/value",
        message: "Erro.",
      },
    }

    expect(isValidationError(error)).toBe(false)
  })

  it("should narrow the error type when the shape matches", () => {
    const maybeValidationError = {
      code: "FST_ERR_VALIDATION",
      validation: [
        {
          instancePath: "/date",
          message: "O campo deve ser uma data.",
        },
      ],
    }

    if (isValidationError(maybeValidationError)) {
      expect(maybeValidationError.validation[0].message).toBe(
        "O campo deve ser uma data."
      )
    } else {
      throw new Error("Expected value to be identified as a ValidationError")
    }
  })
})

describe("errorHandler plugin integration", () => {
  beforeEach(() => {
    process.env.AWESOME_API_KEY = "test-key"
    process.env.AWESOME_API_URL = "https://awesome.local"
    process.env.DB_MONGO_URI = "mongodb://localhost:27017/test"
    process.env.NODE_ENV = "development"
    process.env.LOG_LEVEL = "debug"
    vi.resetModules()
  })

  afterEach(() => {
    process.env.AWESOME_API_KEY = originalEnv.AWESOME_API_KEY
    process.env.AWESOME_API_URL = originalEnv.AWESOME_API_URL
    process.env.DB_MONGO_URI = originalEnv.DB_MONGO_URI
    process.env.NODE_ENV = originalEnv.NODE_ENV
    process.env.LOG_LEVEL = originalEnv.LOG_LEVEL
  })

  async function loadErrorHandlerPlugin() {
    const module = await import("../../../plugins/error-handler.ts")
    return module.errorHandlerPlugin
  }

  it("should return a bad request response for Fastify validation errors", async () => {
    const app = Fastify()
    const errorHandlerPlugin = await loadErrorHandlerPlugin()
    errorHandlerPlugin(app)

    app.get("/test-validation-error", () => {
      const error = new Error(
        "A data de início não pode ser no futuro."
      ) as Error & {
        code: "FST_ERR_VALIDATION"
        validation: Array<{ instancePath: string; message: string }>
      }

      error.code = "FST_ERR_VALIDATION"
      error.validation = [
        {
          instancePath: "/startDate",
          message: "A data de início não pode ser no futuro.",
        },
      ]

      throw error
    })

    const response = await app.inject({
      method: "GET",
      url: "/test-validation-error",
    })

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    expect(response.json()).toEqual({
      code: ErrorCode.VALIDATION_ERROR,
      description: "A data de início não pode ser no futuro.",
      message: "Dados inválidos.",
      statusCode: HttpStatus.BAD_REQUEST,
    })

    await app.close()
  })

  it("should return internal server error for unknown exceptions", async () => {
    const app = Fastify()
    const errorHandlerPlugin = await loadErrorHandlerPlugin()
    errorHandlerPlugin(app)

    app.get("/test-unknown-error", () => {
      throw new Error("Unexpected failure")
    })

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

    await app.close()
  })
})
