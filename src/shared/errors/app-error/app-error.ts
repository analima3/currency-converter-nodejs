import type { AppErrorOptions } from "../../types/errors.types.ts"
import type { ErrorCodeType } from "../../utils/constants/index.ts"

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: ErrorCodeType

  constructor({ code, message, statusCode }: AppErrorOptions) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code

    Error.captureStackTrace?.(this, this.constructor)
  }
}
