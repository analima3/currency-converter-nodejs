import { ErrorCode } from "../utils/constants/error-codes.constants.ts"
import { HttpStatus } from "../utils/constants/http-status.constants.ts"
import { AppError } from "./app-error/app-error.ts"

export class ExternalApiForbiddenError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_FORBIDDEN,
      message: "Acesso negado à API externa de câmbio.",
      statusCode: HttpStatus.FORBIDDEN,
    })
  }
}
