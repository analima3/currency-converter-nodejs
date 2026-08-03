import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorCode, HttpStatus } from "../../shared/utils/constants/index.ts"

const createAwesomeApiProvider = async () => {
  vi.resetModules()
  const module = await import("./awesome-api.provider.ts")
  return module.AwesomeApiProvider
}

describe("AwesomeApiProvider unit", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("should request the external API and map the bid value to exchangeRate", async () => {
    const jsonMock = vi.fn().mockResolvedValue({ USDBRL: { bid: "5.1234" } })
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: jsonMock, ok: true, status: 200 })

    vi.stubGlobal("fetch", fetchMock)

    const { AwesomeApiProvider } = await import("./awesome-api.provider.ts")
    const provider = new AwesomeApiProvider()

    const result = await provider.getExchangeRate({ from: "USD", to: "BRL" })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/last/USD-BRL",
      expect.objectContaining({
        headers: {
          "x-api-key": "test-key",
        },
      })
    )
    expect(result).toEqual({ exchangeRate: 5.1234 })
  })

  it.each([
    [403, ErrorCode.EXTERNAL_API_FORBIDDEN, HttpStatus.FORBIDDEN],
    [404, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND],
    [502, ErrorCode.EXTERNAL_API_ERROR, HttpStatus.BAD_GATEWAY],
    [503, ErrorCode.EXTERNAL_API_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE],
  ])(
    "should throw the correct error when external API returns status %i",
    async (status, expectedCode, expectedStatusCode) => {
      const fetchMock = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({}),
        ok: false,
        status,
      })

      vi.stubGlobal("fetch", fetchMock)

      const { AwesomeApiProvider } = await import("./awesome-api.provider.ts")
      const provider = new AwesomeApiProvider()

      await expect(
        provider.getExchangeRate({ from: "USD", to: "BRL" })
      ).rejects.toMatchObject(
        expect.objectContaining({
          code: expectedCode,
          statusCode: expectedStatusCode,
        })
      )
    }
  )
})

describe("AwesomeApiProvider integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    process.env.AWESOME_API_URL = "https://awesome.integration"
    process.env.AWESOME_API_KEY = "integration-key"
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("should load environment config and request the external API with the configured URL and API key", async () => {
    const jsonMock = vi.fn().mockResolvedValue({ USDBRL: { bid: "5.1234" } })
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: jsonMock, ok: true, status: 200 })

    vi.stubGlobal("fetch", fetchMock)

    const AwesomeApiProvider = await createAwesomeApiProvider()
    const provider = new AwesomeApiProvider()

    const result = await provider.getExchangeRate({ from: "USD", to: "BRL" })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://awesome.integration/last/USD-BRL",
      expect.objectContaining({
        headers: {
          "x-api-key": "integration-key",
        },
      })
    )
    expect(result).toEqual({ exchangeRate: 5.1234 })
  })

  it.each([
    [403, ErrorCode.EXTERNAL_API_FORBIDDEN, HttpStatus.FORBIDDEN],
    [404, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND],
    [502, ErrorCode.EXTERNAL_API_ERROR, HttpStatus.BAD_GATEWAY],
    [503, ErrorCode.EXTERNAL_API_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE],
  ])(
    "should throw mapped AppError when the external API returns status %i",
    async (status, expectedCode, expectedStatusCode) => {
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
          statusCode: expectedStatusCode,
        })
      )
    }
  )
})
