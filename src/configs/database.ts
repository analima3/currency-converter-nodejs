import mongoose from "mongoose"
import { env } from "./env.ts"
import { logger } from "./logger.ts"

export async function connectDatabase() {
  try {
    logger.info("Database connecting...")

    await mongoose.connect(env.DB_MONGO_URI)

    logger.info("Database connect success")
  } catch {
    logger.error("Database connect error")

    process.exit(1)
  }
}
