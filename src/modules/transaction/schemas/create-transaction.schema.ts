import { z } from "zod"

import { transactionSchema } from "./transaction.schema.ts"

export const createTransactionBodySchema = z.object({
  amount: z.number().positive(),
})

export const createTransactionResponseSchema = transactionSchema

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>

export type CreateTransactionResponse = z.infer<
  typeof createTransactionResponseSchema
>
