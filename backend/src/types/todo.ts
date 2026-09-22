export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TodoCategory = 'Work' | 'Personal' | 'Health' | 'Learning' | 'Home' | 'Other'
export type TodoStatusFilter = 'all' | 'active' | 'completed'
export type TodoSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title'
export type SortDirection = 'asc' | 'desc'

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

export interface SessionUser {
  id: string
  username: string
}

export interface TodoCreateRecord {
  title: string
  description: string
  completed: boolean
  priority: TodoPriority
  category: TodoCategory
  tags: string[]
  dueDate: Date | null
  user: SessionUser
}

export interface TodoUpdateRecord {
  title: string
  description: string
  priority: TodoPriority
  category: TodoCategory
  tags: string[]
  dueDate: Date | null
  completed?: boolean
}
