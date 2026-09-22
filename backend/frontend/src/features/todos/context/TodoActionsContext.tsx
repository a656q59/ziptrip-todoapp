/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DeleteTodoDialog } from '@/features/todos/components/DeleteTodoDialog'
import { TodoFormModal } from '@/features/todos/components/TodoFormModal'
import { useTodoMutations } from '@/features/todos/hooks/useTodoMutations'
import { useToast } from '@/context/ToastContext'
import { goToList } from '@/constants/routes'
import type { Todo, TodoWriteInput } from '@/types/todo'
import { getErrorMessage } from '@/utils/getErrorMessage'

type EditorState = { mode: 'create' } | { mode: 'edit'; todo: Todo } | null

interface TodoActionsContextValue {
  openCreate: () => void
  openEdit: (todo: Todo) => void
  requestDelete: (todo: Todo) => void
  toggleComplete: (todo: Todo) => void
  isToggling: (id: string) => boolean
}

const TodoActionsContext = createContext<TodoActionsContextValue | null>(null)

export function TodoActionsProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<EditorState>(null)
  const [deleting, setDeleting] = useState<Todo | null>(null)
  const { notify } = useToast()
  const { createTodo, updateTodo, deleteTodo, toggleTodo } = useTodoMutations()

  const openCreate = useCallback(() => setEditor({ mode: 'create' }), [])
  const openEdit = useCallback((todo: Todo) => setEditor({ mode: 'edit', todo }), [])
  const requestDelete = useCallback((todo: Todo) => setDeleting(todo), [])

  const toggleComplete = useCallback(
    (todo: Todo) => {
      toggleTodo.mutate(
        { id: todo.id, completed: !todo.completed },
        {
          onSuccess: (next) => {
            notify({
              tone: 'success',
              title: next.completed ? 'Marked complete' : 'Marked active',
              description: next.title,
            })
          },
          onError: (error) => {
            notify({ tone: 'danger', title: 'Could not update todo', description: getErrorMessage(error) })
          },
        },
      )
    },
    [notify, toggleTodo],
  )

  const handleSubmit = async (input: TodoWriteInput) => {
    try {
      if (editor?.mode === 'edit') {
        await updateTodo.mutateAsync({ id: editor.todo.id, input })
        notify({ tone: 'success', title: 'Todo updated' })
      } else {
        await createTodo.mutateAsync(input)
        notify({ tone: 'success', title: 'Todo created' })
      }
      setEditor(null)
    } catch (error) {
      notify({ tone: 'danger', title: 'Could not save todo', description: getErrorMessage(error) })
    }
  }

  const handleDelete = async () => {
    if (!deleting) {
      return
    }
    const todo = deleting
    try {
      await deleteTodo.mutateAsync(todo.id)
      setDeleting(null)
      notify({ tone: 'success', title: 'Todo deleted', description: todo.title })
      const onDetails = window.location.pathname.includes('todo')
      const params = new URLSearchParams(window.location.search)
      if (onDetails && params.get('id') === todo.id) {
        goToList()
      }
    } catch (error) {
      notify({ tone: 'danger', title: 'Could not delete todo', description: getErrorMessage(error) })
    }
  }

  const value = useMemo<TodoActionsContextValue>(
    () => ({
      openCreate,
      openEdit,
      requestDelete,
      toggleComplete,
      isToggling: (id: string) => toggleTodo.isPending && toggleTodo.variables?.id === id,
    }),
    [openCreate, openEdit, requestDelete, toggleComplete, toggleTodo.isPending, toggleTodo.variables],
  )

  return (
    <TodoActionsContext.Provider value={value}>
      {children}
      {editor ? (
        <TodoFormModal
          mode={editor.mode}
          todo={editor.mode === 'edit' ? editor.todo : null}
          isSaving={createTodo.isPending || updateTodo.isPending}
          onClose={() => setEditor(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
      {deleting ? (
        <DeleteTodoDialog
          todo={deleting}
          isDeleting={deleteTodo.isPending}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </TodoActionsContext.Provider>
  )
}

export function useTodoActions() {
  const context = useContext(TodoActionsContext)
  if (!context) {
    throw new Error('useTodoActions must be used within TodoActionsProvider')
  }
  return context
}
