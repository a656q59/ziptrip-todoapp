import type { Todo, TodoListQuery, TodoListResult, TodoWriteInput } from '@/types/todo'

export interface TodoRepository {
  list(query: TodoListQuery): Promise<TodoListResult>
  getById(id: string): Promise<Todo>
  create(input: TodoWriteInput): Promise<Todo>
  update(id: string, input: TodoWriteInput): Promise<Todo>
  toggleComplete(id: string, completed: boolean): Promise<Todo>
  remove(id: string): Promise<void>
}
