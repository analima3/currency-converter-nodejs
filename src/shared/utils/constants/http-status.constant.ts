export const HttpStatus = {
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SERVICE_UNAVAILABLE: 503,
} as const

export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus]
