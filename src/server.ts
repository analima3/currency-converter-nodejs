import { buildApp } from "./app.ts"
import { connectDatabase } from "./configs/database.ts"
import { env } from "./configs/env.ts"

const app = await buildApp()

async function start() {
  await connectDatabase()

  app.listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
}

start()
