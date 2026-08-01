export const HttpStatus = {
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
} as const

export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus]
