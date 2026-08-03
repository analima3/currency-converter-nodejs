import { vi } from "vitest"

// Provide minimal environment so modules that parse env won't fail during tests
process.env.AWESOME_API_KEY = process.env.AWESOME_API_KEY || "test-key"
process.env.AWESOME_API_URL = process.env.AWESOME_API_URL || "http://localhost"
process.env.DB_MONGO_URI =
  process.env.DB_MONGO_URI || "mongodb://localhost:27017/currency-test"
process.env.APP_ALLOWED_ORIGINS =
  process.env.APP_ALLOWED_ORIGINS || "http://localhost:3000"
// Ensure NODE_ENV is one of the expected values for the app's env schema
process.env.NODE_ENV = "development"
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "debug"

// Mock `pino` logger globally so `configs/logger.ts` returns a lightweight mock
vi.mock("pino", () => ({
  default: vi.fn(() => ({
    child: vi.fn(() => ({})),
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  })),
}))
