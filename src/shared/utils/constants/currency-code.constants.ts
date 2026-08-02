export const CurrencyCode = {
  BRL: "BRL",
  USD: "USD",
} as const

export const currencyCodeEnumToArray = Object.values(CurrencyCode) as [
  CurrencyCode,
  ...CurrencyCode[],
]

export type CurrencyCode = (typeof CurrencyCode)[keyof typeof CurrencyCode]
