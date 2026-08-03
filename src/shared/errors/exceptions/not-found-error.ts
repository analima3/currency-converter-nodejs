import { ErrorCode, HttpStatus } from "../../utils/constants/index.ts"
import { AppError } from "../app-error/app-error.ts"

export class NotFoundError extends AppError {
  constructor() {
    super({
      code: ErrorCode.NOT_FOUND,
      message: "Nenhum registro encontrado para o ID informado",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }
}
