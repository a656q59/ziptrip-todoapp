import 'dotenv/config'
import { createApp } from './app'
import { env } from './config/env'
import { ensureSessionUser, prisma } from './config/prisma'
import { logger } from './utils/logger'

async function start(): Promise<void> {
  await prisma.$connect()
  await ensureSessionUser()

  const app = createApp()
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'API listening')
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down')
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

start().catch(async (error: unknown) => {
  logger.fatal({ err: error }, 'Failed to start server')
  await prisma.$disconnect()
  process.exit(1)
})
