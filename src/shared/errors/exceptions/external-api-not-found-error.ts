import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { AppError } from "../app-error/app-error.ts"

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
