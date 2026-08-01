import { z } from "zod"

import { transactionSchema } from "./transaction.schema.ts"

export const listTransactionsQuerySchema = z.object({
  endDate: z.iso.datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
  page: z.coerce.number().int().positive().default(1),
  startDate: z.iso.datetime().optional(),
})

export const listTransactionsResponseSchema = z.object({
  data: z.array(transactionSchema),
  limit: z.number(),
  page: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
})

export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>

export type ListTransactionsResponse = z.infer<
  typeof listTransactionsResponseSchema
>
