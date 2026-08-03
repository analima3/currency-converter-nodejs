import { describe, expect, it } from "vitest"
import { CurrencyCode } from "../../../../shared/utils/constants/currency-code.constant.ts"
import {
  getTransactionByIdParamsSchema,
  getTransactionByIdResponseSchema,
} from "./get-transaction-by-id.schema.ts"

describe("getTransactionByIdParamsSchema", () => {
  it("should parse a valid id", () => {
    const result = getTransactionByIdParamsSchema.safeParse({
      id: "507f1f77bcf86cd799439011",
    })

    expect(result.success).toBe(true)
  })

  it("should fail when id is empty", () => {
    const result = getTransactionByIdParamsSchema.safeParse({
      id: "",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "O parametro 'id' é obrigatório."
      )
    }
  })

  it("should fail when id has less than 24 characters", () => {
    const result = getTransactionByIdParamsSchema.safeParse({
      id: "123",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "O parametro 'id' deve conter 24 caracteres."
      )
    }
  })

  it("should fail when id is not a valid hexadecimal string", () => {
    const result = getTransactionByIdParamsSchema.safeParse({
      id: "zzzzzzzzzzzzzzzzzzzzzzzz",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "O parametro 'id' é inválido."
      )
    }
  })
})

describe("getTransactionByIdResponseSchema", () => {
  const validTransaction = {
    amount: 100,
    convertedAmount: 18.25,
    createdAt: "2026-08-03T15:30:00Z",
    currencyFrom: CurrencyCode.BRL,
    currencyTo: CurrencyCode.USD,
    exchangeRate: 0.1825,
    id: "tx-123",
  }

  it("should parse a valid response", () => {
    const result = getTransactionByIdResponseSchema.safeParse(validTransaction)

    expect(result.success).toBe(true)
  })

  it("should fail when response is invalid", () => {
    const result = getTransactionByIdResponseSchema.safeParse({
      ...validTransaction,
      amount: "100",
    })

    expect(result.success).toBe(false)
  })
})
