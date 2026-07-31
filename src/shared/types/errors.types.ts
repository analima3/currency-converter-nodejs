import type { ErrorCodeType } from "../errors/error-codes.ts";
import type { HttpStatusType } from "../errors/http-status.ts";

export interface AppErrorOptions {
  code: ErrorCodeType;
  message: string;
  statusCode: HttpStatusType;
}
