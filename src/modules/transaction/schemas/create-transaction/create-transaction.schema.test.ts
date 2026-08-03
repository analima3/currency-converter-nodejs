import { describe, expect, it } from "vitest"
import { CurrencyCode } from "../../../../shared/utils/constants/currency-code.constant.ts"
import {
  createTransactionBodySchema,
  createTransactionResponseSchema,
} from "./create-transaction.schema.ts"

describe("createTransactionBodySchema", () => {
  const validBody = {
    amount: 100,
    from: CurrencyCode.BRL,
    to: CurrencyCode.USD,
  }

  it("should parse a valid request body", () => {
    const result = createTransactionBodySchema.safeParse(validBody)

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual(validBody)
    }
  })

  it.each([
    [0, "O valor deve um número maior que zero."],
    [-10, "O valor deve um número maior que zero."],
    ["100", "O valor deve um número maior que zero."],
  ])("should reject invalid amount: %s", (amount, message) => {
    const result = createTransactionBodySchema.safeParse({
      ...validBody,
      amount,
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(message)
    }
  })

  it("should reject an invalid source currency", () => {
    const result = createTransactionBodySchema.safeParse({
      ...validBody,
      from: "EUR",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Moeda inválida. Valores aceitos: BRL, USD"
      )
    }
  })

  it("should reject an invalid destination currency", () => {
    const result = createTransactionBodySchema.safeParse({
      ...validBody,
      to: "EUR",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Moeda inválida. Valores aceitos: BRL, USD"
      )
    }
  })
})

describe("createTransactionResponseSchema", () => {
  it("should parse a valid response", () => {
    const result = createTransactionResponseSchema.safeParse({
      amount: 100,
      convertedAmount: 18.25,
      createdAt: "2026-08-03T15:30:00Z",
      currencyFrom: CurrencyCode.BRL,
      currencyTo: CurrencyCode.USD,
      exchangeRate: 0.1825,
      id: "tx-123",
    })

    expect(result.success).toBe(true)
  })
})
