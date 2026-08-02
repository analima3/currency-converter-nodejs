import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"

export class ExternalApiForbiddenError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_FORBIDDEN,
      message: "Acesso negado à API externa de câmbio.",
      statusCode: HttpStatus.FORBIDDEN,
    })
  }
}
