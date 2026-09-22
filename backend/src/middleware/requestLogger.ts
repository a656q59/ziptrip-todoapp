import pinoHttp from 'pino-http'
import { logger } from '../utils/logger'

export const requestLogger = pinoHttp({
  logger,
  autoLogging: true,
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
      }
    },
    res(response) {
      return {
        statusCode: response.statusCode,
      }
    },
  },
})
