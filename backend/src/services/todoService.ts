import { env } from '../config/env'
import { NotFoundError } from '../utils/errors'
import type { TodoRepository } from '../repositories/todoRepository'
import type { Todo, TodoListQuery, TodoListResult, TodoWriteInput } from '../types/todo'

export class TodoService {
  constructor(
    private readonly todos: TodoRepository,
    private readonly session = {
      id: env.SESSION_USER_ID,
      username: env.SESSION_USERNAME,
    },
  ) {}

  list(query: TodoListQuery): Promise<TodoListResult> {
    return this.todos.list(query)
  }

  async getById(id: string): Promise<Todo> {
    const todo = await this.todos.findById(id)
    if (!todo) {
      throw new NotFoundError()
    }
    return todo
  }

  create(input: TodoWriteInput): Promise<Todo> {
    return this.todos.create({
      title: input.title,
      description: input.description,
      completed: Boolean(input.completed),
      priority: input.priority,
      category: input.category,
      tags: input.tags,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      user: this.session,
    })
  }

  async update(id: string, input: TodoWriteInput): Promise<Todo> {
    const todo = await this.todos.update(id, {
      title: input.title,
      description: input.description,
      priority: input.priority,
      category: input.category,
      tags: input.tags,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      completed: input.completed,
    })
    if (!todo) {
      throw new NotFoundError()
    }
    return todo
  }

  async toggleComplete(id: string, completed: boolean): Promise<Todo> {
    const todo = await this.todos.toggleComplete(id, completed)
    if (!todo) {
      throw new NotFoundError()
    }
    return todo
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.todos.delete(id)
    if (!deleted) {
      throw new NotFoundError()
    }
  }
}
