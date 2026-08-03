import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { errorHandler } from "../error-handler/error-handler.ts"
import { AppError } from "./app-error.ts"

function createMockReply() {
  const sendSpy = vi.fn()
  const statusSpy = vi.fn(() => ({ send: sendSpy }))

  return {
    reply: { status: statusSpy } as any,
    sendSpy,
    statusSpy,
  }
}

describe("AppError unit", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should create an AppError instance with correct properties", () => {
    const error = new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Resource not found",
      statusCode: HttpStatus.NOT_FOUND,
    })

    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe("AppError")
    expect(error.message).toBe("Resource not found")
    expect(error.code).toBe(ErrorCode.NOT_FOUND)
    expect(error.statusCode).toBe(HttpStatus.NOT_FOUND)
  })

  it("should preserve stack trace when AppError is created", () => {
    const error = new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Resource not found",
      statusCode: HttpStatus.NOT_FOUND,
    })

    expect(error.stack).toBeTypeOf("string")
    expect(error.stack).toContain("AppError")
    expect(error.stack).toContain("Resource not found")
  })
})

describe("AppError integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should be handled by the errorHandler and send AppError payload", () => {
    const appError = new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Resource not found",
      statusCode: HttpStatus.NOT_FOUND,
    })

    const req: any = { method: "GET", url: "/test" }
    const { reply, sendSpy, statusSpy } = createMockReply()

    errorHandler(appError, req, reply)

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(sendSpy).toHaveBeenCalledWith({
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
    })
  })
})
