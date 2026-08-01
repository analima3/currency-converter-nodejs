import type { AwesomeApiProvider } from "../../../providers/awesome/awesome-api.provider.ts"
import { TransactionNotFoundError } from "../../../shared/errors/transaction-not-found-error.ts"
import type { FilterOptions } from "../../../shared/types/filter.types.ts"
import type {
  PaginationOptions,
  PaginationResponse,
} from "../../../shared/types/pagination.types.ts"
import type { Transaction } from "../models/transaction.model.ts"
import type { TransactionRepository } from "../repositories/transaction.repository.ts"
import type { CreateTransactionBody } from "../schemas/create-transaction.schema.ts"

export class TransactionService {
  private readonly repository: TransactionRepository
  private readonly provider: AwesomeApiProvider

  constructor(repository: TransactionRepository, provider: AwesomeApiProvider) {
    this.repository = repository
    this.provider = provider
  }

  async create({ amount }: CreateTransactionBody): Promise<Transaction> {
    const { exchangeRate } = await this.provider.getExchangeRate()

    const convertedAmount = amount * exchangeRate

    const createdTransaction: Transaction = await this.repository.create({
      amount,
      convertedAmount,
      exchangeRate,
    })

    return createdTransaction
  }

  async findById(id: string) {
    const transaction = await this.repository.findById(id)

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    return transaction.toJSON()
  }

  async findMany(
    pagination: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginationResponse<Transaction>> {
    const totalElements: number = await this.repository.count(filters)
    const totalPages = Math.ceil(totalElements / pagination.limit)
    const transactions = await this.repository.findMany(pagination, filters)
    const data = transactions.map((transaction) => transaction.toJSON())

    return {
      data,
      pagination: {
        ...pagination,
        totalElements,
        totalPages,
      },
    }
  }
}
