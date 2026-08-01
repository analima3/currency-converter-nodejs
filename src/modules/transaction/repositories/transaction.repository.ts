import type { QueryFilter } from "mongoose"
import type { FilterOptions } from "../../../shared/types/filter.types.ts"
import type { PaginationOptions } from "../../../shared/types/pagination.types.ts"
import {
  type Transaction,
  TransactionModel,
} from "../models/transaction.model.ts"

const ONE = 1

export class TransactionRepository {
  create(
    transaction: Omit<
      Transaction,
      "_id" | "createdAt" | "currencyFrom" | "currencyTo"
    >
  ) {
    return TransactionModel.create(transaction)
  }

  findById(id: string) {
    return TransactionModel.findById(id)
  }

  findMany(pagination: PaginationOptions, filters?: FilterOptions) {
    const query = this.buildQuery(filters)
    const offset = (pagination.page - ONE) * pagination.limit

    return TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(pagination.limit)
  }

  count(filters?: FilterOptions) {
    const query = this.buildQuery(filters)

    return TransactionModel.countDocuments(query)
  }

  private buildQuery(filters?: FilterOptions) {
    const query: QueryFilter<Transaction> = {}

    if (filters?.startDate) {
      query.createdAt = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      }
    }

    return query
  }
}
