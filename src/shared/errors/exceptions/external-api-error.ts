import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { AppError } from "../app-error/app-error.ts"

export class ExternalApiError extends AppError {
  constructor() {
    super({
      code: ErrorCode.EXTERNAL_API_ERROR,
      message: "Falha ao tentar recuperar a taxa de câmbio.",
      statusCode: HttpStatus.BAD_GATEWAY,
    })
  }
}
