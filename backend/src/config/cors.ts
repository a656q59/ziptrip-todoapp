import type { CorsOptions } from 'cors'
import { env } from '../config/env'

const localDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

export function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
}

export function isAllowedOrigin(origin: string | undefined, allowedOrigins: string[], nodeEnv: string): boolean {
  if (!origin) {
    return true
  }
  if (allowedOrigins.includes(origin)) {
    return true
  }
  if (nodeEnv !== 'production' && localDevOrigin.test(origin)) {
    return true
  }
  return false
}

export function createCorsOptions(): CorsOptions {
  const allowedOrigins = parseCorsOrigins(env.CORS_ORIGIN)

  return {
    origin(origin, callback) {
      if (isAllowedOrigin(origin, allowedOrigins, env.NODE_ENV)) {
        callback(null, origin ?? true)
        return
      }
      callback(null, false)
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Content-Type'],
    maxAge: 600,
    optionsSuccessStatus: 204,
  }
}
