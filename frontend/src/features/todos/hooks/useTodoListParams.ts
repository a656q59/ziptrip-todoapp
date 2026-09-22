import { useCallback, useEffect, useMemo, useState } from 'react'
import { SEARCH_DEBOUNCE_MS } from '@/constants/todo'
import type { TodoListQuery, TodoSortField, TodoStatusFilter } from '@/types/todo'
import { parseListQuery, serializeListQuery } from '@/utils/listQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function useTodoListParams() {
  const [query, setQuery] = useState<TodoListQuery>(() => parseListQuery(window.location.search))
  const [searchDraft, setSearchDraft] = useState(query.search)
  const debouncedSearch = useDebouncedValue(searchDraft, SEARCH_DEBOUNCE_MS)

  const commit = useCallback((next: TodoListQuery) => {
    setQuery(next)
    window.history.replaceState({}, '', serializeListQuery(next))
  }, [])

  useEffect(() => {
    if (debouncedSearch !== query.search) {
      commit({ ...query, search: debouncedSearch, page: 1 })
    }
  }, [commit, debouncedSearch, query])

  const effectiveQuery = useMemo(
    () => ({
      ...query,
      search: debouncedSearch,
    }),
    [debouncedSearch, query],
  )

  const setSearch = (search: string) => {
    setSearchDraft(search)
  }

  const setStatus = (status: TodoStatusFilter) => {
    commit({ ...query, status, page: 1, search: debouncedSearch })
  }

  const setSort = (sort: TodoSortField) => {
    commit({ ...query, sort, page: 1, search: debouncedSearch })
  }

  const setDirection = (direction: TodoListQuery['direction']) => {
    commit({ ...query, direction, page: 1, search: debouncedSearch })
  }

  const setPage = (page: number) => {
    commit({ ...query, page, search: debouncedSearch })
  }

  return {
    query: effectiveQuery,
    searchDraft,
    setSearch,
    setStatus,
    setSort,
    setDirection,
    setPage,
  }
}
