import { beforeEach, describe, expect, it, vi } from "vitest"

import { TransactionController } from "./transaction.controller.ts"

describe("TransactionController", () => {
  let service: {
    create: ReturnType<typeof vi.fn>
    findById: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
  }

  let controller: TransactionController

  beforeEach(() => {
    service = {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
    }

    controller = new TransactionController(service as any)
  })

  describe("create", () => {
    it("should create a transaction", async () => {
      const body = {
        amount: 100,
        from: "BRL",
        to: "USD",
      }

      const transaction = {
        id: "123",
      }

      service.create.mockResolvedValue(transaction)

      const request = {
        body,
      }

      const send = vi.fn()
      const status = vi.fn().mockReturnValue({ send })

      const reply = {
        status,
      }

      await controller.create(request as any, reply as any)

      expect(service.create).toHaveBeenCalledWith(body)
      expect(status).toHaveBeenCalledWith(201)
      expect(send).toHaveBeenCalledWith(transaction)
    })
  })

  describe("findById", () => {
    it("should return a transaction", async () => {
      const transaction = {
        id: "123",
      }

      service.findById.mockResolvedValue(transaction)

      const request = {
        params: {
          id: "123",
        },
      }

      const send = vi.fn()
      const status = vi.fn().mockReturnValue({ send })

      const reply = {
        status,
      }

      await controller.findById(request as any, reply as any)

      expect(service.findById).toHaveBeenCalledWith("123")
      expect(status).toHaveBeenCalledWith(200)
      expect(send).toHaveBeenCalledWith(transaction)
    })
  })

  describe("findMany", () => {
    it("should return paginated transactions", async () => {
      const response = {
        data: [],
        pagination: {
          limit: 10,
          page: 1,
          totalElements: 0,
          totalPages: 0,
        },
      }

      service.findMany.mockResolvedValue(response)

      const request = {
        query: {
          endDate: new Date("2026-08-31"),
          limit: 10,
          page: 1,
          startDate: new Date("2026-08-01"),
        },
      }

      const send = vi.fn()
      const status = vi.fn().mockReturnValue({ send })

      const reply = {
        status,
      }

      await controller.findMany(request as any, reply as any)

      expect(service.findMany).toHaveBeenCalledWith(
        {
          limit: 10,
          page: 1,
        },
        {
          endDate: new Date("2026-08-31"),
          startDate: new Date("2026-08-01"),
        }
      )

      expect(status).toHaveBeenCalledWith(200)
      expect(send).toHaveBeenCalledWith(response)
    })
  })
})
