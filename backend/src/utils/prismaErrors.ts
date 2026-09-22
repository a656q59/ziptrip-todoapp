import { Prisma } from '@prisma/client'
import { ConflictError } from './errors'

export function mapPrismaError(error: unknown): never | void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictError('A record with this unique value already exists', 'UNIQUE_CONSTRAINT')
    }
    if (error.code === 'P2025') {
      return
    }
  }
  throw error
}
