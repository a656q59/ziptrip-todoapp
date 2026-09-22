import { PrismaClient } from '@prisma/client'
import { env } from './env'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

export async function ensureSessionUser(): Promise<void> {
  await prisma.user.upsert({
    where: { id: env.SESSION_USER_ID },
    create: {
      id: env.SESSION_USER_ID,
      username: env.SESSION_USERNAME,
    },
    update: {
      username: env.SESSION_USERNAME,
    },
  })
}
