import { z } from "zod"
import { currencyCodeEnumToArray } from "../../../shared/utils/constants/currency-code.constants.ts"
import { transactionSchema } from "./transaction.schema.ts"

export const createTransactionBodySchema = z.object({
  amount: z.number().positive(),
  from: z.enum(currencyCodeEnumToArray as [string, ...string[]], {
    error: `Moeda inválida. Valores aceitos: ${currencyCodeEnumToArray.join(", ")}`,
  }),
  to: z.enum(currencyCodeEnumToArray as [string, ...string[]], {
    error: `Moeda inválida. Valores aceitos: ${currencyCodeEnumToArray.join(", ")}`,
  }),
})

export const createTransactionResponseSchema = transactionSchema

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>

export type CreateTransactionResponse = z.infer<
  typeof createTransactionResponseSchema
>
