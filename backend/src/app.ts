import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { createCorsOptions } from './config/cors'
import { PrismaTodoRepository } from './repositories/todoRepository'
import { TodoService } from './services/todoService'
import { TodoController } from './controllers/todoController'
import { createTodoRouter } from './routes/todoRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')
  app.use(
    helmet({
      // APIs are called from the Vite origin; same-origin CORP blocks the browser.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )
  app.use(cors(createCorsOptions()))
  app.use(express.json({ limit: '32kb' }))
  app.use(requestLogger)

  const service = new TodoService(new PrismaTodoRepository())
  const controller = new TodoController(service)

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/api/todos', createTodoRouter(controller))
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
