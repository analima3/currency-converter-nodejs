import { describe, expect, it } from "vitest"
import { listTransactionsQuerySchema } from "../../../modules/transaction/schemas/get-many-transaction.schema.ts"
import { validateDateRange } from "./date-range.validation.ts"

describe("validateDateRange utility", () => {
  it("should return no issues for valid start and end dates within the allowed range", () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
    const endDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)

    const issues = validateDateRange({ endDate, startDate })

    expect(issues).toHaveLength(0)
  })

  it("should return no issues when only startDate is provided and it is not in the future", () => {
    const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24)

    const issues = validateDateRange({ startDate })

    expect(issues).toHaveLength(0)
  })

  it("should return no issues when only endDate is provided and it is not in the future", () => {
    const endDate = new Date(Date.now() - 1000 * 60 * 60 * 24)

    const issues = validateDateRange({ endDate })

    expect(issues).toHaveLength(0)
  })

  it("should return an issue when startDate is in the future", () => {
    const startDate = new Date(Date.now() + 1000 * 60 * 60)

    const issues = validateDateRange({ startDate })

    expect(issues).toEqual([
      {
        code: "custom",
        message: "A data de início não pode ser no futuro.",
        path: ["startDate"],
      },
    ])
  })

  it("should return an issue when endDate is in the future", () => {
    const endDate = new Date(Date.now() + 1000 * 60 * 60)

    const issues = validateDateRange({ endDate })

    expect(issues).toEqual([
      {
        code: "custom",
        message: "A data de fim não pode ser no futuro.",
        path: ["endDate"],
      },
    ])
  })

  it("should return an issue when endDate is equal to startDate", () => {
    const now = new Date()

    const issues = validateDateRange({ endDate: new Date(now), startDate: now })

    expect(issues).toEqual([
      {
        code: "custom",
        message: "A data de fim deve ser maior que a data de início.",
        path: ["endDate"],
      },
    ])
  })

  it("should return an issue when the date range exceeds 365 days", () => {
    const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 366)
    const endDate = new Date()

    const issues = validateDateRange({ endDate, startDate })

    expect(issues).toEqual([
      {
        code: "custom",
        message: "O intervalo entre as datas não pode exceder 365 dias.",
        path: ["endDate"],
      },
    ])
  })
})

describe("listTransactionsQuerySchema integration", () => {
  it("should parse valid query parameters and apply default pagination values", () => {
    const now = new Date()
    const startDate = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 7
    ).toISOString()
    const endDate = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 1
    ).toISOString()

    const result = listTransactionsQuerySchema.parse({
      endDate,
      startDate,
    })

    expect(result.limit).toBe(10)
    expect(result.page).toBe(1)
    expect(result.startDate).toBeInstanceOf(Date)
    expect(result.endDate).toBeInstanceOf(Date)

    if (result.startDate && result.endDate) {
      expect(result.startDate.getTime()).toBeLessThan(result.endDate.getTime())
    } else {
      throw new Error("Parsed dates are missing")
    }
  })

  it("should reject queries when startDate is in the future", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString()

    const result = listTransactionsQuerySchema.safeParse({
      startDate: futureDate,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          message: "A data de início não pode ser no futuro.",
          path: ["startDate"],
        }),
      ])
    }
  })

  it("should reject queries when endDate is before startDate", () => {
    const now = new Date()
    const startDate = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 1
    ).toISOString()
    const endDate = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 2
    ).toISOString()

    const result = listTransactionsQuerySchema.safeParse({
      endDate,
      startDate,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          message: "A data de fim deve ser maior que a data de início.",
          path: ["endDate"],
        }),
      ])
    }
  })
})
