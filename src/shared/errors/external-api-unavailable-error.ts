import { ErrorCode } from "../utils/constants/error-codes.constants.ts"
import { HttpStatus } from "../utils/constants/http-status.constants.ts"
import { AppError } from "./app-error/app-error.ts"

export class ExternalApiUnavailableError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_UNAVAILABLE,
      message: "Serviço externo de câmbio indisponível no momento.",
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    })
  }
}
