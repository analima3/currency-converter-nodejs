import { z } from "zod"
import { CurrencyCode } from "../../../shared/utils/constants/currency-code.constants.ts"

export const transactionSchema = z.object({
  amount: z.number(),
  convertedAmount: z.number(),
  createdAt: z.iso.datetime(),
  currencyFrom: z.literal(CurrencyCode.BRL),
  currencyTo: z.literal(CurrencyCode.USD),
  exchangeRate: z.number(),
  id: z.string(),
})

export type TransactionResponse = z.infer<typeof transactionSchema>
