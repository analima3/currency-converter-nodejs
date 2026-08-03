import { describe, expect, it } from "vitest"
import { CurrencyCode } from "../../../../shared/utils/constants/currency-code.constant.ts"
import {
  getManyTransactionsQuerySchema,
  getManyTransactionsResponseSchema,
} from "./get-many-transaction.schema.ts"

describe("getManyTransactionsQuerySchema", () => {
  it("should apply default values", () => {
    const result = getManyTransactionsQuerySchema.safeParse({})

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual({
        limit: 10,
        page: 1,
      })
    }
  })

  it("should coerce page and limit to numbers", () => {
    const result = getManyTransactionsQuerySchema.safeParse({
      limit: "25",
      page: "2",
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.page).toBe(2)
      expect(result.data.limit).toBe(25)
    }
  })

  it("should coerce startDate and endDate to Date", () => {
    const result = getManyTransactionsQuerySchema.safeParse({
      endDate: "2026-08-03T00:00:00.000Z",
      startDate: "2026-08-01T00:00:00.000Z",
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
      expect(result.data.endDate).toBeInstanceOf(Date)
    }
  })

  it.each([
    [{ page: 0 }, "A página deve ser um número maior ou igual a 1."],
    [{ limit: 0 }, "O limite deve ser um número entre 1 e 1000."],
    [{ limit: 1001 }, "O limite deve ser um número entre 1 e 1000."],
    [{ startDate: "invalid-date" }, "A data de início é inválida."],
    [{ endDate: "invalid-date" }, "A data de fim é inválida."],
  ])("should reject invalid query %#", (query, message) => {
    const result = getManyTransactionsQuerySchema.safeParse(query)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(message)
    }
  })

  it("should reject unknown query keys", () => {
    const result = getManyTransactionsQuerySchema.safeParse({
      startDat: "2026-08-01T00:00:00.000Z",
    })

    expect(result.success).toBe(false)
  })

  it("should reject when startDate is after endDate", () => {
    const result = getManyTransactionsQuerySchema.safeParse({
      endDate: "2026-08-01T00:00:00.000Z",
      startDate: "2026-08-10T00:00:00.000Z",
    })

    expect(result.success).toBe(false)

    // Opcional: valide também a mensagem produzida por validateDateRange
    // expect(result.error.issues[0]?.message).toBe(...)
  })
})

describe("getManyTransactionsResponseSchema", () => {
  const transaction = {
    amount: 100,
    convertedAmount: 18.25,
    createdAt: "2026-08-03T15:30:00Z",
    currencyFrom: CurrencyCode.BRL,
    currencyTo: CurrencyCode.USD,
    exchangeRate: 0.1825,
    id: "tx-123",
  }

  it("should parse a valid response", () => {
    const result = getManyTransactionsResponseSchema.safeParse({
      data: [transaction],
      pagination: {
        limit: 10,
        page: 1,
        totalElements: 1,
        totalPages: 1,
      },
    })

    expect(result.success).toBe(true)
  })

  it("should reject an invalid transaction", () => {
    const result = getManyTransactionsResponseSchema.safeParse({
      data: [
        {
          ...transaction,
          amount: "100",
        },
      ],
      pagination: {
        limit: 10,
        page: 1,
        totalElements: 1,
        totalPages: 1,
      },
    })

    expect(result.success).toBe(false)
  })

  it("should reject an invalid pagination object", () => {
    const result = getManyTransactionsResponseSchema.safeParse({
      data: [transaction],
      pagination: {
        limit: 10,
        page: "1",
        totalElements: 1,
        totalPages: 1,
      },
    })

    expect(result.success).toBe(false)
  })
})
