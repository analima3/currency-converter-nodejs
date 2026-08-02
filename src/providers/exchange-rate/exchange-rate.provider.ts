export interface GetExchangeRateParams {
  from: string
  to: string
}

export interface ExchangeRate {
  exchangeRate: number
}

export interface ExchangeRateProvider {
  getExchangeRate: (params: GetExchangeRateParams) => Promise<ExchangeRate>
}
