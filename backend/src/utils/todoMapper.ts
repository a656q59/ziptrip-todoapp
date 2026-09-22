import type { Category, Priority, Tag, Todo, User } from '@prisma/client'
import type { Todo as TodoDto } from '../types/todo'

export type TodoRecord = Todo & {
  tags: Tag[]
  user: Pick<User, 'id' | 'username'>
}

export function toTodoDto(todo: TodoRecord): TodoDto {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    priority: todo.priority as Priority,
    category: todo.category as Category,
    tags: todo.tags.map((tag) => tag.name),
    userId: todo.userId,
    username: todo.user.username,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
  }
}
