import { HttpTodoRepository } from '@/services/todos/httpTodoRepository'
import type { TodoRepository } from '@/services/todos/todoRepository'

let repository: TodoRepository | null = null

export function getTodoRepository(): TodoRepository {
  if (!repository) {
    repository = new HttpTodoRepository()
  }
  return repository
}
