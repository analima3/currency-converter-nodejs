import type { FastifyInstance } from "fastify"
import { AwesomeApiProvider } from "../../../providers/awesome/awesome-api.provider.ts"
import { TransactionController } from "../controllers/transaction.controller.ts"
import { TransactionRepository } from "../repositories/transaction.repository.ts"
import {
  createTransactionBodySchema,
  createTransactionResponseSchema,
} from "../schemas/create-transaction/create-transaction.schema.ts"
import {
  getManyTransactionsQuerySchema,
  getManyTransactionsResponseSchema,
} from "../schemas/get-many-transaction/get-many-transaction.schema.ts"
import { getTransactionByIdParamsSchema } from "../schemas/get-transaction-by-id/get-transaction-by-id.schema.ts"
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

  app.post(`${prefix}`, {
    handler: controller.create.bind(controller),
    schema: {
      body: createTransactionBodySchema,
      description:
        "Cria uma nova transação de conversão de moeda usando a cotação atual.",
      response: {
        201: createTransactionResponseSchema,
      },
      summary: "Criar transação",
      tags: ["Transações"],
    },
  })

  app.get(`${prefix}/:id`, {
    handler: controller.findById.bind(controller),
    schema: {
      description: "Retorna uma transação pelo seu identificador.",
      params: getTransactionByIdParamsSchema,
      response: {
        200: createTransactionResponseSchema,
      },
      summary: "Buscar transação por ID",
      tags: ["Transações"],
    },
  })

  app.get(`${prefix}`, {
    handler: controller.findMany.bind(controller),
    schema: {
      description:
        "Retorna uma lista paginada de transações. É possível filtrar por data de criação.",
      querystring: getManyTransactionsQuerySchema,
      response: {
        200: getManyTransactionsResponseSchema,
      },
      summary: "Listar transações",
      tags: ["Transações"],
    },
  })
}
