import pino from "pino"

import { env } from "./env.ts"

export const logger = pino({
  level: env.LOG_LEVEL,

  transport:
    env.NODE_ENV === "production"
      ? undefined
      : {
          options: {
            colorize: true,
            errorLikeObjectKeys: ["err"],
            ignore: "pid,hostname",
            singleLine: true,
            translateTime: "HH:MM:ss",
          },
          target: "pino-pretty",
        },
})
