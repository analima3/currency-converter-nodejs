import type { AwesomeApiProvider } from "../../../providers/awesome/awesome-api.provider.ts"
import { NotFoundError } from "../../../shared/errors/not-found-error.ts"
import type { FilterOptions } from "../../../shared/types/filter.types.ts"
import type {
  PaginationOptions,
  PaginationResponse,
} from "../../../shared/types/pagination.types.ts"
import type { CurrencyCode } from "../../../shared/utils/constants/currency-code.constants.ts"
import type { Transaction } from "../models/transaction.model.ts"
import type { TransactionRepository } from "../repositories/transaction.repository.ts"

interface CreateTransactionInput {
  amount: number
  from: CurrencyCode
  to: CurrencyCode
}

export class TransactionService {
  private readonly repository: TransactionRepository
  private readonly provider: AwesomeApiProvider

  constructor(repository: TransactionRepository, provider: AwesomeApiProvider) {
    this.repository = repository
    this.provider = provider
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const { exchangeRate } = await this.provider.getExchangeRateByCurrency({
      from: input.from,
      to: input.to,
    })

    const exchangeRateFormatted = Number(exchangeRate.toFixed(6))
    const amountFormatted = Number(input.amount.toFixed(2))

    const convertedAmount = amountFormatted * exchangeRateFormatted
    const convertedAmountFormatted = Number(convertedAmount.toFixed(2))

    const createdTransaction: Transaction = await this.repository.create({
      amount: amountFormatted,
      convertedAmount: convertedAmountFormatted,
      exchangeRate: exchangeRateFormatted,
    })

    return createdTransaction
  }

  async findById(id: string) {
    const transaction = await this.repository.findById(id)

    if (!transaction) {
      throw new NotFoundError()
    }

    return transaction
  }

  async findMany(
    pagination: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginationResponse<Transaction>> {
    const totalElements: number = await this.repository.count(filters)
    const totalPages = Math.ceil(totalElements / pagination.limit)

    const transactions = await this.repository.findMany(pagination, filters)

    return {
      data: transactions,
      pagination: {
        ...pagination,
        totalElements,
        totalPages,
      },
    }
  }
}
