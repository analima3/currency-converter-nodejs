import { describe, expect, it } from "vitest"
import { CurrencyCode } from "../../../../shared/utils/constants/currency-code.constant.ts"
import { transactionSchema } from "./transaction.schema.ts"

describe("transactionSchema", () => {
  const validTransaction = {
    amount: 100,
    convertedAmount: 18.25,
    createdAt: "2026-08-03T15:30:00Z",
    currencyFrom: CurrencyCode.BRL,
    currencyTo: CurrencyCode.USD,
    exchangeRate: 0.1825,
    id: "tx-123",
  }

  it("should parse a valid transaction", () => {
    const result = transactionSchema.safeParse(validTransaction)

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual(validTransaction)
    }
  })

  it("should fail when amount is not a number", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      amount: "100",
    })

    expect(result.success).toBe(false)
  })

  it("should fail when convertedAmount is not a number", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      convertedAmount: "18.25",
    })

    expect(result.success).toBe(false)
  })

  it("should fail when exchangeRate is not a number", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      exchangeRate: "0.1825",
    })

    expect(result.success).toBe(false)
  })

  it("should fail when currencyFrom is not BRL", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      currencyFrom: CurrencyCode.USD,
    })

    expect(result.success).toBe(false)
  })

  it("should fail when currencyTo is not USD", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      currencyTo: CurrencyCode.BRL,
    })

    expect(result.success).toBe(false)
  })

  it("should fail when createdAt is not a valid ISO datetime", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      createdAt: "03/08/2026",
    })

    expect(result.success).toBe(false)
  })

  it("should fail when id is not a string", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      id: 123,
    })

    expect(result.success).toBe(false)
  })

  it("should fail when a required field is missing", () => {
    const { exchangeRate, ...transactionWithoutExchangeRate } = validTransaction

    const result = transactionSchema.safeParse(transactionWithoutExchangeRate)

    expect(result.success).toBe(false)
  })
})
