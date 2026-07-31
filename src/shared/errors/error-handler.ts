import type { FastifyReply, FastifyRequest } from 'fastify'

import { HttpStatus } from './http-status.ts';
import { ErrorCode } from './error-codes.ts';
import { AppError } from './app-error.ts';

export function errorHandler(error: unknown, request: FastifyRequest, reply: FastifyReply) {
  console.log('passei pelo error handler');
  
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            code: error.code,
            message: error.message,
        })
    }

    return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do servidor.'
    })
}
