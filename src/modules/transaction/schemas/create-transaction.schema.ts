import { z } from "zod"

import { transactionSchema } from "./transaction.schema.ts"

export const createTransactionBodySchema = z.object({
  amount: z.number().positive(),
})

export const createTransactionResponseSchema = transactionSchema

export type CreateTransactionBodySchema = z.infer<
  typeof createTransactionBodySchema
>

export type CreateTransactionResponseSchema = z.infer<
  typeof createTransactionResponseSchema
>
