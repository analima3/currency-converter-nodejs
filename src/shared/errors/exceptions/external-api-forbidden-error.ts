import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { AppError } from "../app-error/app-error.ts"

export class ExternalApiForbiddenError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_FORBIDDEN,
      message: "Acesso negado à API externa de câmbio.",
      statusCode: HttpStatus.FORBIDDEN,
    })
  }
}
