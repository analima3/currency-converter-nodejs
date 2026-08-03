import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { ExchangeRateProvider } from "../../../providers/exchange-rate/exchange-rate.provider.ts"
import { NotFoundError } from "../../../shared/errors/exceptions/index.ts"
import type { FilterOptions } from "../../../shared/types/filter.types.ts"
import type { PaginationOptions } from "../../../shared/types/pagination.types.ts"
import type { Transaction } from "../models/transaction.model.ts"
import type { TransactionRepository } from "../repositories/transaction.repository.ts"
import { TransactionService } from "./transaction.service.ts"

describe("TransactionService unit", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should create a transaction using the provider exchange rate and formatted values", async () => {
    const provider: ExchangeRateProvider = {
      getExchangeRate: vi.fn().mockResolvedValue({ exchangeRate: 5.123_456 }),
    }

    const createSpy = vi.fn(async (transaction) => ({
      id: "transaction-id",
      ...transaction,
      createdAt: new Date().toISOString(),
    }))

    const service = new TransactionService(
      {
        create: createSpy,
      } as unknown as TransactionRepository,
      provider
    )

    const result = await service.create({
      amount: 123.4567,
      from: "USD",
      to: "BRL",
    })

    expect(provider.getExchangeRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
    })

    expect(createSpy).toHaveBeenCalledWith({
      amount: 123.46,
      convertedAmount: Number((123.46 * 5.123_456).toFixed(2)),
      exchangeRate: 5.123_456,
    })

    expect(result).toEqual(
      expect.objectContaining({
        amount: 123.46,
        convertedAmount: Number((123.46 * 5.123_456).toFixed(2)),
        exchangeRate: 5.123_456,
        id: "transaction-id",
      })
    )
  })

  it("should throw NotFoundError when a transaction is not found by id", async () => {
    const repository: TransactionRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as TransactionRepository

    const provider: ExchangeRateProvider = {
      getExchangeRate: vi.fn(),
    }

    const service = new TransactionService(repository, provider)

    await expect(service.findById("missing-id")).rejects.toBeInstanceOf(
      NotFoundError
    )

    expect(repository.findById).toHaveBeenCalledWith("missing-id")
  })

  it("should return a transaction when findById resolves a record", async () => {
    const transaction = {
      amount: 100,
      convertedAmount: 520,
      createdAt: "2026-01-01T00:00:00.000Z",
      exchangeRate: 5.2,
      id: "transaction-id",
    } as unknown as Transaction

    const repository: TransactionRepository = {
      findById: vi.fn().mockResolvedValue(transaction),
    } as unknown as TransactionRepository

    const provider: ExchangeRateProvider = {
      getExchangeRate: vi.fn(),
    }

    const service = new TransactionService(repository, provider)

    await expect(service.findById("transaction-id")).resolves.toEqual(
      transaction
    )
    expect(repository.findById).toHaveBeenCalledWith("transaction-id")
  })

  it("should return paginated transactions when findMany is called", async () => {
    const pagination: PaginationOptions = {
      limit: 2,
      page: 1,
    }

    const filters: FilterOptions = {
      endDate: new Date("2026-01-31T23:59:59.999Z"),
      startDate: new Date("2026-01-01T00:00:00.000Z"),
    }

    const savedTransactions = [
      {
        amount: 10,
        convertedAmount: 50,
        createdAt: "2026-01-01T00:00:00.000Z",
        exchangeRate: 5,
        id: "transaction-1",
      },
    ] as unknown as Transaction[]

    const repository: TransactionRepository = {
      count: vi.fn().mockResolvedValue(5),
      findMany: vi.fn().mockResolvedValue(savedTransactions),
    } as unknown as TransactionRepository

    const provider: ExchangeRateProvider = {
      getExchangeRate: vi.fn(),
    }

    const service = new TransactionService(repository, provider)

    const result = await service.findMany(pagination, filters)

    expect(repository.count).toHaveBeenCalledWith(filters)
    expect(repository.findMany).toHaveBeenCalledWith(pagination, filters)
    expect(result).toEqual({
      data: savedTransactions,
      pagination: {
        ...pagination,
        totalElements: 5,
        totalPages: Math.ceil(5 / pagination.limit),
      },
    })
  })
})
