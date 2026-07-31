export const HttpStatus = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const

export type HttpStatusType = typeof HttpStatus[keyof typeof HttpStatus]
