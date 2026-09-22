import type { ErrorRequestHandler, RequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { env } from '../config/env'
import { AppError, BadRequestError, ConflictError } from '../utils/errors'
import { logger } from '../utils/logger'

interface ErrorBody {
  message: string
  code: string
  status: number
  details?: unknown
}

function toBody(error: AppError): ErrorBody {
  return {
    message: error.message,
    code: error.code,
    status: error.status,
    ...(error.details !== undefined ? { details: error.details } : {}),
  }
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    message: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    status: 404,
  })
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof AppError) {
    if (error.status >= 500) {
      logger.error({ err: error, path: req.path }, error.message)
    } else {
      logger.warn({ err: error, path: req.path, code: error.code }, error.message)
    }
    res.status(error.status).json(toBody(error))
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    const badRequest = new BadRequestError('Malformed JSON body', 'INVALID_JSON')
    res.status(badRequest.status).json(toBody(badRequest))
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    const conflict = new ConflictError('A record with this unique value already exists', 'UNIQUE_CONSTRAINT')
    res.status(conflict.status).json(toBody(conflict))
    return
  }

  logger.error({ err: error, path: req.path }, 'Unhandled error')

  const message = env.NODE_ENV === 'production' ? 'Internal server error' : 'Internal server error'
  res.status(500).json({
    message,
    code: 'INTERNAL_ERROR',
    status: 500,
  })
}
