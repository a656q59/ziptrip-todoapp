import { DEFAULT_LIST_QUERY } from '@/constants/todo'
import type { TodoListQuery, TodoSortField, TodoStatusFilter } from '@/types/todo'
import { SORT_DIRECTIONS, TODO_SORT_FIELDS, TODO_STATUS_FILTERS } from '@/types/todo'

function isStatus(value: string): value is TodoStatusFilter {
  return (TODO_STATUS_FILTERS as readonly string[]).includes(value)
}

function isSort(value: string): value is TodoSortField {
  return (TODO_SORT_FIELDS as readonly string[]).includes(value)
}

export function parseListQuery(search: string): TodoListQuery {
  const params = new URLSearchParams(search)
  const page = Number(params.get('page'))
  const searchTerm = params.get('q') ?? DEFAULT_LIST_QUERY.search
  const status = params.get('status') ?? DEFAULT_LIST_QUERY.status
  const sort = params.get('sort') ?? DEFAULT_LIST_QUERY.sort
  const direction = params.get('dir') ?? DEFAULT_LIST_QUERY.direction

  return {
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_LIST_QUERY.page,
    pageSize: DEFAULT_LIST_QUERY.pageSize,
    search: searchTerm,
    status: isStatus(status) ? status : DEFAULT_LIST_QUERY.status,
    sort: isSort(sort) ? sort : DEFAULT_LIST_QUERY.sort,
    direction: direction === SORT_DIRECTIONS[0] ? 'asc' : 'desc',
  }
}

export function serializeListQuery(query: TodoListQuery): string {
  const params = new URLSearchParams()

  if (query.page > 1) {
    params.set('page', String(query.page))
  }
  if (query.search.trim()) {
    params.set('q', query.search.trim())
  }
  if (query.status !== DEFAULT_LIST_QUERY.status) {
    params.set('status', query.status)
  }
  if (query.sort !== DEFAULT_LIST_QUERY.sort) {
    params.set('sort', query.sort)
  }
  if (query.direction !== DEFAULT_LIST_QUERY.direction) {
    params.set('dir', query.direction)
  }

  const serialized = params.toString()
  return serialized ? `/?${serialized}` : '/'
}
