import type { QueryFilter } from "mongoose"
import type { FilterOptions } from "../../../shared/types/filter.types.ts"
import type { PaginationOptions } from "../../../shared/types/pagination.types.ts"
import {
  type Transaction,
  TransactionModel,
} from "../models/transaction.model.ts"

const ONE = 1

export class TransactionRepository {
  async create(
    transaction: Omit<
      Transaction,
      "_id" | "createdAt" | "currencyFrom" | "currencyTo"
    >
  ) {
    return (await TransactionModel.create(transaction)).toJSON()
  }

  async findById(id: string) {
    return (await TransactionModel.findById(id))?.toJSON()
  }

  async findMany(pagination: PaginationOptions, filters?: FilterOptions) {
    const query = this.buildQuery(filters)
    const offset = (pagination.page - ONE) * pagination.limit

    const documents = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(pagination.limit)

    return documents.map((document) => document.toJSON())
  }

  async count(filters?: FilterOptions) {
    const query = this.buildQuery(filters)

    return await TransactionModel.countDocuments(query)
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
