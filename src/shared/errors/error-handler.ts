import type { FastifyReply, FastifyRequest } from "fastify"

import { logger } from "../../configs/logger.ts"
import { AppError } from "./app-error.ts"
import { ErrorCode } from "./error-codes.ts"
import { HttpStatus } from "./http-status.ts"
import { isValidationError } from "./validation-error.ts"

function getApplicationStack(error: Error) {
  return error.stack
    ?.split("\n")
    .find((line) => line.includes("/src/"))
    ?.trim()
}

export function errorHandler(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    logger.error({
      message: error.message,
      method: request.method,
      url: request.url,
    })

    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  if (isValidationError(error)) {
    logger.error({
      message: error.validation[0].message,
      method: request.method,
      url: request.url,
    })

    return reply.status(HttpStatus.BAD_REQUEST).send({
      code: ErrorCode.VALIDATION_ERROR,
      description: error.validation[0].message,
      message: "Dados inválidos.",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  if (error instanceof Error) {
    logger.error({
      message: error.message,
      method: request.method,
      source: getApplicationStack(error),
      url: request.url,
    })
  } else {
    logger.error({
      message: "Unknown error",
      method: request.method,
      url: request.url,
    })
  }

  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Erro interno do servidor.",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  })
}
