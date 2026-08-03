import { env } from "../../configs/env.ts"
import {
  statusErrorFactory,
} from "../../shared/errors/exceptions/index.ts"
import type {
  ExchangeRateProvider,
  GetExchangeRateParams,
} from "../exchange-rate/exchange-rate.provider.ts"
import type { AwesomeApiResponse, ExchangeRate } from "./awesome-api.types.ts"

export class AwesomeApiProvider implements ExchangeRateProvider {
  async getExchangeRate(params: GetExchangeRateParams): Promise<ExchangeRate> {
    const URL = `${env.AWESOME_API_URL}/last/${params.from}-${params.to}`

    const response = await fetch(URL, {
      headers: {
        "x-api-key": env.AWESOME_API_KEY,
      },
    })

    if (!response.ok) {
      const errorForStatus = statusErrorFactory.get(response.status)

      if (errorForStatus) {
        throw errorForStatus()
      }
    }

    const data = (await response.json()) as AwesomeApiResponse

    return this.mapResponse(data, params)
  }

  private mapResponse(
    response: AwesomeApiResponse,
    params: GetExchangeRateParams
  ): ExchangeRate {
    const currency = response[`${params.from}${params.to}`]

    return {
      exchangeRate: Number(currency.bid),
    }
  }
}
