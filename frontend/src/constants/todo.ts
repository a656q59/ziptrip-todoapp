import type { TodoPriority, TodoSortField, TodoStatusFilter } from '@/types/todo'

export const PAGE_SIZE = 8
export const SEARCH_DEBOUNCE_MS = 300
export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 2000
export const TAG_MAX_LENGTH = 24
export const TAG_MAX_COUNT = 8

export const DEFAULT_LIST_QUERY = {
  page: 1,
  pageSize: PAGE_SIZE,
  search: '',
  status: 'all' as TodoStatusFilter,
  sort: 'createdAt' as TodoSortField,
  direction: 'desc' as const,
}

export const PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}
