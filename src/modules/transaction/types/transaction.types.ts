import type { CreateTransactionBodySchema } from "../schemas/create-transaction.schema.ts"
import type { GetTransactionByIdParams } from "../schemas/get-transaction-by-id.schema.ts"

export interface CreateTransactionInput extends CreateTransactionBodySchema {
  amount: number
}

export interface CreateTransactionRequest {
  Body: CreateTransactionBodySchema
}

export interface GetByIDTransactionRequest {
  Params: GetTransactionByIdParams
}

export interface GetManyTransactionRequest {
  Querystring: {
    page: number
    limit: number
    startDate?: Date
    endDate?: Date
  }
}
