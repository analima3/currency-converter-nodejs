import type { AppError } from "../app-error/app-error.ts"
import { ExternalApiError } from "./external-api-error.ts"
import { ExternalApiForbiddenError } from "./external-api-forbidden-error.ts"
import { ExternalApiNotFoundError } from "./external-api-not-found-error.ts"
import { ExternalApiUnavailableError } from "./external-api-unavailable-error.ts"

export const statusErrorFactory = new Map<number, () => AppError>([
  [403, (): AppError => new ExternalApiForbiddenError() as AppError],
  [404, (): AppError => new ExternalApiNotFoundError() as AppError],
  [503, (): AppError => new ExternalApiUnavailableError() as AppError],
  [502, (): AppError => new ExternalApiError() as AppError],
])
