import { describe, expect, it } from "vitest"

import { CurrencyCode } from "../../../shared/utils/constants/index.ts"
import { TransactionModel } from "./transaction.model.ts"

describe("TransactionModel", () => {
  it("should apply default values", () => {
    const transaction = new TransactionModel({
      amount: 100,
      convertedAmount: 18.5,
      exchangeRate: 0.185,
    })

    expect(transaction.currencyFrom).toBe(CurrencyCode.BRL)
    expect(transaction.currencyTo).toBe(CurrencyCode.USD)
    expect(transaction.createdAt).toBeInstanceOf(Date)
  })

  it("should convert _id into id", () => {
    const transaction = new TransactionModel({
      amount: 100,
      convertedAmount: 18.5,
      exchangeRate: 0.185,
    })

    const json = transaction.toJSON() as Record<string, any>

    expect(json.id).toBe(transaction._id.toString())
    expect(json).not.toHaveProperty("_id")
  })

  it("should serialize createdAt as an ISO string", () => {
    const transaction = new TransactionModel({
      amount: 100,
      convertedAmount: 18.5,
      exchangeRate: 0.185,
    })

    const json = transaction.toJSON()

    expect(json.createdAt).toBe(transaction.createdAt.toISOString())
  })

  it("should have an index on createdAt", () => {
    expect(TransactionModel.schema.indexes()).toContainEqual([
      { createdAt: -1 },
      {},
    ])
  })
})
