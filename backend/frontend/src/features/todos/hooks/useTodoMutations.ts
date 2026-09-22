import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoKeys } from '@/features/todos/utils/queryKeys'
import { getTodoRepository } from '@/services/todos/createTodoRepository'
import type { TodoWriteInput } from '@/types/todo'

export function useTodoMutations() {
  const queryClient = useQueryClient()
  const repository = getTodoRepository()

  const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: todoKeys.all })

  const createTodo = useMutation({
    mutationFn: (input: TodoWriteInput) => repository.create(input),
    onSuccess: invalidateTodos,
  })

  const updateTodo = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TodoWriteInput }) => repository.update(id, input),
    onSuccess: async (todo) => {
      await invalidateTodos()
      queryClient.setQueryData(todoKeys.detail(todo.id), todo)
    },
  })

  const toggleTodo = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      repository.toggleComplete(id, completed),
    onSuccess: async (todo) => {
      await invalidateTodos()
      queryClient.setQueryData(todoKeys.detail(todo.id), todo)
    },
  })

  const deleteTodo = useMutation({
    mutationFn: (id: string) => repository.remove(id),
    onSuccess: async (_void, id) => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) })
      await invalidateTodos()
    },
  })

  return { createTodo, updateTodo, toggleTodo, deleteTodo }
}
