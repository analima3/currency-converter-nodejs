import type { QueryFilter } from 'mongoose'
import { FilterOptions } from '../../../shared/types/filter.types.ts'
import { PaginationOptions } from '../../../shared/types/pagination.types.ts'
import { Transaction, TransactionModel } from '../models/transaction.model.ts'

const ONE = 1

export class TransactionRepository {
    create (transaction: Omit<Transaction, '_id'>) {
        return TransactionModel.create(transaction)
    }

    findById(id: string) {
        return TransactionModel.findById(id)
    }

    findMany(options: PaginationOptions, filters?: FilterOptions) {
        const query = this.buildQuery(filters)
        const offset = (options.page - ONE) * options.limit

        return TransactionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(options.limit)
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
                $lte: filters.endDate
            }
        }

        return query
    }
}