import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  exchangeRate: z.number(),
  convertedAmount: z.number(),
  currencyFrom: z.literal('BRL'),
  currencyTo: z.literal('USD'),
  createdAt: z.iso.datetime(),
})

export type Transaction = z.infer<typeof transactionSchema>