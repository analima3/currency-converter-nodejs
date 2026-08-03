import type { ErrorCodeType, HttpStatusType } from "../utils/constants/index.ts"

export interface AppErrorOptions {
  code: ErrorCodeType
  message: string
  statusCode: HttpStatusType
}
