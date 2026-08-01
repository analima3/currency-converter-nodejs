import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"

export class NotFoundError extends AppError {
  constructor() {
    super({
      code: ErrorCode.NOT_FOUND,
      message: "Nenhum registro encontrado para o ID informado",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }
}
