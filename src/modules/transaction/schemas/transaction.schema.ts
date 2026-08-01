import { z } from "zod"

export const transactionSchema = z.object({
  amount: z.number(),
  convertedAmount: z.number(),
  createdAt: z.iso.datetime(),
  currencyFrom: z.literal("BRL"),
  currencyTo: z.literal("USD"),
  exchangeRate: z.number(),
  id: z.string(),
})

export type Transaction = z.infer<typeof transactionSchema>
