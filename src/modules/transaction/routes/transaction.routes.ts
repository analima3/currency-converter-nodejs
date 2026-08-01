import type { FastifyInstance } from "fastify"
import { AwesomeApiProvider } from "../../../providers/awesome/awesome-api.provider.ts"
import { TransactionController } from "../controllers/transaction.controller.ts"
import { TransactionRepository } from "../repositories/transaction.repository.ts"
import {
  createTransactionBodySchema,
  createTransactionResponseSchema,
} from "../schemas/create-transaction.schema.ts"
import { getTransactionByIdParamsSchema } from "../schemas/get-transaction-by-id.schema.ts"
import { listTransactionsQuerySchema } from "../schemas/list-transaction.schema.ts"
import { TransactionService } from "../services/transaction.service.ts"

interface TransactionRoutesOptions {
  prefix: string
}

export function transactionRoutes(
  app: FastifyInstance,
  { prefix }: TransactionRoutesOptions
) {
  const repository = new TransactionRepository()

  const provider = new AwesomeApiProvider()

  const service = new TransactionService(repository, provider)

  const controller = new TransactionController(service)

  app.post(`${prefix}/create`, {
    handler: controller.create.bind(controller),
    schema: {
      body: createTransactionBodySchema,
      response: {
        201: createTransactionResponseSchema,
      },
    },
  })

  app.get(`${prefix}/:id`, {
    handler: controller.findById.bind(controller),
    schema: {
      params: getTransactionByIdParamsSchema,
      response: {
        200: createTransactionResponseSchema,
      },
    },
  })

  app.get(`${prefix}`, {
    handler: controller.findMany.bind(controller),
    schema: {
      querystring: listTransactionsQuerySchema,
    },
  })
}
