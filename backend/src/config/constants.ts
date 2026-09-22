import type { TodoPriority } from '../types/todo'

export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 2000
export const TAG_MAX_LENGTH = 24
export const TAG_MAX_COUNT = 8
export const DEFAULT_PAGE_SIZE = 8
export const MAX_PAGE_SIZE = 50

export const TODO_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export const TODO_CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Home', 'Other'] as const
export const TODO_STATUS_FILTERS = ['all', 'active', 'completed'] as const
export const TODO_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'] as const
export const SORT_DIRECTIONS = ['asc', 'desc'] as const

export const PRIORITY_RANK: Record<TodoPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}
