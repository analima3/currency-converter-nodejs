import type { CreateTransactionBody } from "../schemas/create-transaction.schema.ts"
import type { GetTransactionByIdParams } from "../schemas/get-transaction-by-id.schema.ts"

export interface CreateTransactionRequest {
  Body: CreateTransactionBody
}

export interface GetByIDTransactionRequest {
  Params: GetTransactionByIdParams
}
