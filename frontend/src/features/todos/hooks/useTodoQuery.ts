import { useQuery } from '@tanstack/react-query'
import { todoKeys } from '@/features/todos/utils/queryKeys'
import { getTodoRepository } from '@/services/todos/createTodoRepository'

export function useTodoQuery(id: string | null) {
  const repository = getTodoRepository()

  return useQuery({
    queryKey: todoKeys.detail(id ?? ''),
    queryFn: () => repository.getById(id ?? ''),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      if (typeof error === 'object' && error && 'status' in error && error.status === 404) {
        return false
      }
      return failureCount < 1
    },
  })
}
