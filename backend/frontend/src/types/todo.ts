export const TODO_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TodoPriority = (typeof TODO_PRIORITIES)[number]

export const TODO_CATEGORIES = [
  'Work',
  'Personal',
  'Health',
  'Learning',
  'Home',
  'Other',
] as const
export type TodoCategory = (typeof TODO_CATEGORIES)[number]

export const TODO_STATUS_FILTERS = ['all', 'active', 'completed'] as const
export type TodoStatusFilter = (typeof TODO_STATUS_FILTERS)[number]

export const TODO_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'] as const
export type TodoSortField = (typeof TODO_SORT_FIELDS)[number]

export const SORT_DIRECTIONS = ['asc', 'desc'] as const
export type SortDirection = (typeof SORT_DIRECTIONS)[number]

export interface User {
  id: string
  username: string
}

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: TodoPriority
  category: TodoCategory
  tags: string[]
  userId: string
  username: string
  createdAt: string
  updatedAt: string
  dueDate: string | null
}

export interface TodoWriteInput {
  title: string
  description: string
  priority: TodoPriority
  category: TodoCategory
  tags: string[]
  dueDate: string | null
  completed?: boolean
}

export interface TodoListQuery {
  page: number
  pageSize: number
  search: string
  status: TodoStatusFilter
  sort: TodoSortField
  direction: SortDirection
}

export interface TodoListResult {
  items: Todo[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  counts: {
    all: number
    active: number
    completed: number
  }
}
