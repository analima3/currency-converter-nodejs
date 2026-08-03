import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TransactionService } from "../../modules/transaction/services/transaction.service.ts"
import { ErrorCode, HttpStatus } from "../../shared/utils/constants/index.ts"
import type { ExchangeRateProvider } from "./exchange-rate.provider.ts"

describe("ExchangeRateProvider contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should create a transaction using the provider exchange rate and format values correctly", async () => {
    const provider: ExchangeRateProvider = {
      getExchangeRate: vi.fn().mockResolvedValue({ exchangeRate: 5.123_456 }),
    }

    const createSpy = vi.fn(async (transaction) => ({
      id: "transaction-id",
      ...transaction,
      createdAt: new Date().toISOString(),
    }))

    const service = new TransactionService(
      { create: createSpy } as any,
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
})

describe("AwesomeApiProvider integration", () => {
  function getExpectedStatusCode(status: number) {
    switch (status) {
      case 403:
        return HttpStatus.FORBIDDEN
      case 404:
        return HttpStatus.NOT_FOUND
      case 502:
        return HttpStatus.BAD_GATEWAY
      case 503:
        return HttpStatus.SERVICE_UNAVAILABLE
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  async function createAwesomeApiProvider() {
    vi.resetModules()
    const module = await import("../awesome/awesome-api.provider.ts")
    return module.AwesomeApiProvider
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.AWESOME_API_KEY = "test-key"
    process.env.AWESOME_API_URL = "https://awesome.example"
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("should request the external API and map the bid value to exchangeRate", async () => {
    const jsonMock = vi.fn().mockResolvedValue({ USDBRL: { bid: "5.1234" } })
    const fetchMock = vi.fn().mockResolvedValue({
      json: jsonMock,
      ok: true,
      status: 200,
    })

    vi.stubGlobal("fetch", fetchMock)

    const AwesomeApiProvider = await createAwesomeApiProvider()
    const provider = new AwesomeApiProvider()
    const result = await provider.getExchangeRate({ from: "USD", to: "BRL" })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://awesome.example/last/USD-BRL",
      expect.objectContaining({
        headers: {
          "x-api-key": "test-key",
        },
      })
    )

    expect(result).toEqual({ exchangeRate: 5.1234 })
  })

  it.each([
    [403, ErrorCode.EXTERNAL_API_FORBIDDEN],
    [404, ErrorCode.NOT_FOUND],
    [502, ErrorCode.EXTERNAL_API_ERROR],
    [503, ErrorCode.EXTERNAL_API_UNAVAILABLE],
  ])(
    "should throw the correct error when external API returns status %i",
    async (status, expectedCode) => {
      const fetchMock = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({}),
        ok: false,
        status,
      })

      vi.stubGlobal("fetch", fetchMock)

      const AwesomeApiProvider = await createAwesomeApiProvider()
      const provider = new AwesomeApiProvider()

      await expect(
        provider.getExchangeRate({ from: "USD", to: "BRL" })
      ).rejects.toMatchObject(
        expect.objectContaining({
          code: expectedCode,
          statusCode: getExpectedStatusCode(status),
        })
      )
    }
  )
})
