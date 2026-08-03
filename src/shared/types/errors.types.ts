import type { ErrorCodeType } from "../utils/constants/error-codes.constants.ts"
import type { HttpStatusType } from "../utils/constants/http-status.constants.ts"

export interface AppErrorOptions {
  code: ErrorCodeType
  message: string
  statusCode: HttpStatusType
}
