import pino from "pino"

import { env } from "./env.ts"

export const logger = pino({
  level: env.LOG_LEVEL,

  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: true,
            errorLikeObjectKeys: ["err"],
          },
        }
      : undefined,
})
