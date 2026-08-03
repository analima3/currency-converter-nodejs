import type { CurrencyCode } from "../../shared/utils/constants/index.ts"

export interface AwesomeApiRequest {
  from: CurrencyCode
  to: CurrencyCode
}

export interface AwesomeApiResponse {
  [fromTo: string]: {
    bid: string
  }
}

export interface ExchangeRate {
  exchangeRate: number
}
