import { Router } from 'express'
import type { TodoController } from '../controllers/todoController'
import { asyncHandler } from '../utils/asyncHandler'

export function createTodoRouter(controller: TodoController): Router {
  const router = Router()

  router.get('/', asyncHandler(controller.list))
  router.post('/', asyncHandler(controller.create))
  router.get('/:id', asyncHandler(controller.getById))
  router.patch('/:id/complete', asyncHandler(controller.toggleComplete))
  router.patch('/:id', asyncHandler(controller.update))
  router.delete('/:id', asyncHandler(controller.remove))

  return router
}
