import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"

export class ExternalApiUnavailableError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_UNAVAILABLE,
      message: "Serviço externo de câmbio indisponível no momento.",
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    })
  }
}
