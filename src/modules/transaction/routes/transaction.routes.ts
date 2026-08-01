import type { FastifyInstance } from "fastify"
import { AwesomeApiProvider } from "../../../providers/awesome/awesome-api.provider.ts"
import { TransactionController } from "../controllers/transaction.controller.ts"
import { TransactionRepository } from "../repositories/transaction.repository.ts"
import {
  createTransactionBodySchema,
  createTransactionResponseSchema,
} from "../schemas/create-transaction.schema.ts"
import {
  listTransactionsQuerySchema,
  listTransactionsResponseSchema,
} from "../schemas/get-many-transaction.schema.ts"
import { getTransactionByIdParamsSchema } from "../schemas/get-transaction-by-id.schema.ts"
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
      description:
        "Creates a new currency conversion transaction using the current exchange rate.",

      response: {
        201: createTransactionResponseSchema,
      },
      summary: "Create transaction",
      tags: ["Transactions"],
    },
  })

  app.get(`${prefix}/:id`, {
    handler: controller.findById.bind(controller),
    schema: {
      description: "Returns a transaction by its identifier.",

      params: getTransactionByIdParamsSchema,

      response: {
        200: createTransactionResponseSchema,
      },
      summary: "Find transaction by id",
      tags: ["Transactions"],
    },
  })

  app.get(`${prefix}`, {
    handler: controller.findMany.bind(controller),
    schema: {
      description:
        "Returns a paginated list of transactions. It is possible to filter by creation date.",

      querystring: listTransactionsQuerySchema,

      response: {
        200: listTransactionsResponseSchema,
      },
      summary: "List transactions",
      tags: ["Transactions"],
    },
  })
}
