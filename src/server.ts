import { buildApp } from './app.ts'
import { env } from './configs/env.ts'
import { connectDatabase } from './configs/database.ts'

const app = buildApp()

async function start() {
    await connectDatabase()
    
    app.listen({
        port: env.PORT,
        host: '0.0.0.0'
    })
}

start()