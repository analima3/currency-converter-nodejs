import { z } from "zod"
import { validateDateRange } from "../../../shared/utils/validations/date-range.validation.ts"
import { transactionSchema } from "./transaction.schema.ts"

const LIMIT_RULE_MESSAGE = "O limite deve ser um número entre 1 e 1000."

export const listTransactionsQuerySchema = z
  .object({
    endDate: z.iso
      .datetime({ message: "A data de fim é inválida.", offset: true })
      .pipe(z.coerce.date({ message: "A data de fim é inválida." }))
      .optional(),
    limit: z.coerce
      .number(LIMIT_RULE_MESSAGE)
      .min(1, LIMIT_RULE_MESSAGE)
      .max(1000, LIMIT_RULE_MESSAGE)
      .default(10),
    page: z.coerce
      .number("A página deve ser um número.")
      .min(1, "A página deve ser um número maior ou igual a 1.")
      .default(1),
    startDate: z.iso
      .datetime({ message: "A data de início é inválida.", offset: true })
      .pipe(z.coerce.date({ message: "A data de início é inválida." }))
      .optional(),
  })
  .superRefine((data, ctx) => {
    const issues = validateDateRange(data)

    for (const issue of issues) {
      ctx.addIssue(issue)
    }
  })

export const listTransactionsResponseSchema = z.object({
  data: z.array(transactionSchema),
  limit: z.number(),
  page: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
})

export type ListTransactionsQuerySchema = z.infer<
  typeof listTransactionsQuerySchema
>

export type ListTransactionsResponseSchema = z.infer<
  typeof listTransactionsResponseSchema
>
