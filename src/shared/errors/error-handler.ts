import type { FastifyReply } from "fastify"
import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"

export function errorHandler(error: unknown, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Erro interno do servidor.",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  })
}
