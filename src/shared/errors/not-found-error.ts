import { ErrorCode } from "../utils/constants/error-codes.constants.ts"
import { HttpStatus } from "../utils/constants/http-status.constants.ts"
import { AppError } from "./app-error/app-error.ts"

export class NotFoundError extends AppError {
  constructor() {
    super({
      code: ErrorCode.NOT_FOUND,
      message: "Nenhum registro encontrado para o ID informado",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }
}
