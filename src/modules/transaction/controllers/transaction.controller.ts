import type { FastifyReply, FastifyRequest } from "fastify"
import type { TransactionService } from "../services/transaction.service.ts"
import type {
  CreateTransactionRequest,
  GetByIDTransactionRequest,
  GetManyTransactionRequest,
} from "../types/transaction.types.ts"

export class TransactionController {
  private readonly service: TransactionService

  constructor(service: TransactionService) {
    this.service = service
  }

  async create(
    request: FastifyRequest<CreateTransactionRequest>,
    reply: FastifyReply
  ) {
    const { amount } = request.body
    const transaction = await this.service.create(amount)

    reply.status(201).send(transaction)
  }

  async findById(
    request: FastifyRequest<GetByIDTransactionRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params

    const transaction = await this.service.findById(id)

    reply.status(200).send(transaction)
  }

  async findMany(
    request: FastifyRequest<GetManyTransactionRequest>,
    reply: FastifyReply
  ) {
    const { page, limit, startDate, endDate } = request.query

    const pagination = {
      limit,
      page,
    }

    const filters = {
      endDate,
      startDate,
    }

    const transactions = await this.service.findMany(pagination, filters)

    reply.status(200).send(transactions)
  }
}
