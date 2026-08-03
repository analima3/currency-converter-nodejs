import { ErrorCode } from "../utils/constants/error-codes.constants.ts"
import { HttpStatus } from "../utils/constants/http-status.constants.ts"
import { AppError } from "./app-error/app-error.ts"

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
