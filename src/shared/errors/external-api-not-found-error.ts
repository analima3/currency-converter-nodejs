import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"

export class ExternalApiNotFoundError extends AppError {
  constructor() {
    super({
      code: ErrorCode.NOT_FOUND,
      message:
        "Não foi possível encontrar a taxa de câmbio para as moedas informadas.",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }
}
