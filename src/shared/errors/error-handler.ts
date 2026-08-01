import type { FastifyReply } from "fastify"
import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"
import { isValidationError } from "./validation-error.ts"

export function errorHandler(error: unknown, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  if (isValidationError(error)) {
    return reply.status(HttpStatus.BAD_REQUEST).send({
      code: ErrorCode.VALIDATION_ERROR,
      description: error.validation[0].message,
      message: "Dados inválidos.",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Erro interno do servidor.",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  })
}
