import { describe, expect, it, vi } from "vitest"
import {
  createTransactionBodySchema,
  createTransactionResponseSchema,
} from "../schemas/create-transaction/create-transaction.schema.ts"
import {
  getManyTransactionsQuerySchema,
  getManyTransactionsResponseSchema,
} from "../schemas/get-many-transaction/get-many-transaction.schema.ts"
import { getTransactionByIdParamsSchema } from "../schemas/get-transaction-by-id/get-transaction-by-id.schema.ts"
import { transactionRoutes } from "./transaction.routes.ts"

describe("transactionRoutes", () => {
  it("should register all transaction routes", () => {
    const app = {
      get: vi.fn(),
      post: vi.fn(),
    }

    transactionRoutes(app as any, {
      prefix: "/transactions",
    })

    expect(app.post).toHaveBeenCalledTimes(1)
    expect(app.get).toHaveBeenCalledTimes(2)
  })

  it("should register POST /transactions", () => {
    const app = {
      get: vi.fn(),
      post: vi.fn(),
    }

    transactionRoutes(app as any, {
      prefix: "/transactions",
    })

    expect(app.post).toHaveBeenCalledWith(
      "/transactions",
      expect.objectContaining({
        handler: expect.any(Function),
        schema: expect.objectContaining({
          body: createTransactionBodySchema,
          response: {
            201: createTransactionResponseSchema,
          },
        }),
      })
    )
  })

  it("should register GET /transactions/:id", () => {
    const app = {
      get: vi.fn(),
      post: vi.fn(),
    }

    transactionRoutes(app as any, {
      prefix: "/transactions",
    })

    expect(app.get).toHaveBeenNthCalledWith(
      1,
      "/transactions/:id",
      expect.objectContaining({
        handler: expect.any(Function),
        schema: expect.objectContaining({
          params: getTransactionByIdParamsSchema,
          response: {
            200: createTransactionResponseSchema,
          },
        }),
      })
    )
  })

  it("should register GET /transactions", () => {
    const app = {
      get: vi.fn(),
      post: vi.fn(),
    }

    transactionRoutes(app as any, {
      prefix: "/transactions",
    })

    expect(app.get).toHaveBeenNthCalledWith(
      2,
      "/transactions",
      expect.objectContaining({
        handler: expect.any(Function),
        schema: expect.objectContaining({
          querystring: getManyTransactionsQuerySchema,
          response: {
            200: getManyTransactionsResponseSchema,
          },
        }),
      })
    )
  })
})
