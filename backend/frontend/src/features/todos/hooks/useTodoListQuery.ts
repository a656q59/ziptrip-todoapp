import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { todoKeys } from '@/features/todos/utils/queryKeys'
import { getTodoRepository } from '@/services/todos/createTodoRepository'
import type { TodoListQuery } from '@/types/todo'

export function useTodoListQuery(query: TodoListQuery) {
  const repository = getTodoRepository()

  return useQuery({
    queryKey: todoKeys.list(query),
    queryFn: () => repository.list(query),
    placeholderData: keepPreviousData,
  })
}
