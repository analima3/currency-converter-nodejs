import { z } from "zod"
import { currencyCodeEnumToArray } from "../../../../shared/utils/constants/index.ts"
import { transactionSchema } from "../transaction/transaction.schema.ts"

const AMOUNT_MESSAGE = "O valor deve um número maior que zero."

export const createTransactionBodySchema = z.object({
  amount: z.number(AMOUNT_MESSAGE).positive(AMOUNT_MESSAGE),
  from: z.enum(currencyCodeEnumToArray, {
    error: `Moeda inválida. Valores aceitos: ${currencyCodeEnumToArray.join(", ")}`,
  }),
  to: z.enum(currencyCodeEnumToArray, {
    error: `Moeda inválida. Valores aceitos: ${currencyCodeEnumToArray.join(", ")}`,
  }),
})

export const createTransactionResponseSchema = transactionSchema

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>

export type CreateTransactionResponse = z.infer<
  typeof createTransactionResponseSchema
>
