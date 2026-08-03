import { beforeEach, describe, expect, it, vi } from "vitest"
import { TransactionModel } from "../models/transaction.model.ts"
import { TransactionRepository } from "./transaction.repository.ts"

vi.mock("../models/transaction.model.ts", () => ({
  TransactionModel: {
    countDocuments: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
  },
}))

describe("TransactionRepository", () => {
  let repository: TransactionRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new TransactionRepository()
  })

  describe("create", () => {
    it("should create a transaction", async () => {
      const transaction = {
        amount: 100,
        convertedAmount: 18.2,
        exchangeRate: 0.182,
      }

      const document = {
        toJSON: vi.fn().mockReturnValue({
          id: "123",
          ...transaction,
        }),
      }

      vi.mocked(TransactionModel.create).mockResolvedValue(document as any)

      const result = await repository.create(transaction as any)

      expect(TransactionModel.create).toHaveBeenCalledWith(transaction)
      expect(result).toEqual({
        id: "123",
        ...transaction,
      })
    })
  })

  describe("findById", () => {
    it("should return a transaction", async () => {
      const document = {
        toJSON: vi.fn().mockReturnValue({
          id: "123",
        }),
      }

      vi.mocked(TransactionModel.findById).mockResolvedValue(document as any)

      const result = await repository.findById("123")

      expect(TransactionModel.findById).toHaveBeenCalledWith("123")
      expect(result).toEqual({
        id: "123",
      })
    })

    it("should return undefined when transaction does not exist", async () => {
      vi.mocked(TransactionModel.findById).mockResolvedValue(null)

      const result = await repository.findById("123")

      expect(result).toBeUndefined()
    })
  })

  describe("count", () => {
    it("should count all documents", async () => {
      vi.mocked(TransactionModel.countDocuments).mockResolvedValue(15)

      const result = await repository.count()

      expect(TransactionModel.countDocuments).toHaveBeenCalledWith({})
      expect(result).toBe(15)
    })

    it("should count filtered documents", async () => {
      const startDate = new Date("2026-08-01")
      const endDate = new Date("2026-08-31")

      vi.mocked(TransactionModel.countDocuments).mockResolvedValue(5)

      await repository.count({
        endDate,
        startDate,
      })

      expect(TransactionModel.countDocuments).toHaveBeenCalledWith({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
    })
  })
})
