import { z } from "zod"

import { transactionSchema } from "../transaction/transaction.schema.ts"

const ID_REGEX = /^[0-9a-fA-F]{24}$/

export const getTransactionByIdParamsSchema = z.object({
  id: z
    .string()
    .nonempty("O parametro 'id' é obrigatório.")
    .min(24, "O parametro 'id' deve conter 24 caracteres.")
    .regex(ID_REGEX, "O parametro 'id' é inválido."),
})

export const getTransactionByIdResponseSchema = transactionSchema

export type GetTransactionByIdParams = z.infer<
  typeof getTransactionByIdParamsSchema
>

export type GetTransactionByIdResponse = z.infer<
  typeof getTransactionByIdResponseSchema
>
