import { z } from 'zod'

import { transactionSchema } from './transaction.schema.ts'

export const getTransactionByIdParamsSchema = z.object({
  id: z.string(),
})

export const getTransactionByIdResponseSchema = transactionSchema

export type GetTransactionByIdParams = z.infer<
  typeof getTransactionByIdParamsSchema
>

export type GetTransactionByIdResponse = z.infer<
  typeof getTransactionByIdResponseSchema
>