import { AppLayout } from '@/layouts/AppLayout'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/EmptyState'
import { Spinner } from '@/components/feedback/Spinner'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { TodoFilters } from '@/features/todos/components/TodoFilters'
import { TodoList } from '@/features/todos/components/TodoList'
import { useTodoActions } from '@/features/todos/context/TodoActionsContext'
import { useTodoListParams } from '@/features/todos/hooks/useTodoListParams'
import { useTodoListQuery } from '@/features/todos/hooks/useTodoListQuery'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { Button } from '@/components/ui/Button'

export function TodoListPage() {
  const { openCreate } = useTodoActions()
  const { query, searchDraft, setSearch, setStatus, setSort, setDirection, setPage } = useTodoListParams()
  const { data, isPending, isError, error, isFetching, refetch } = useTodoListQuery(query)

  return (
    <AppLayout
      title="Todos"
      subtitle="Create, organize, and review work across independent list and details documents."
    >
      <TodoFilters
        query={query}
        searchDraft={searchDraft}
        counts={data?.counts}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onDirectionChange={setDirection}
      />

      {isPending ? <Spinner label="Loading todos" /> : null}

      {isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : null}

      {data && data.items.length === 0 ? (
        <EmptyState
          title={query.search || query.status !== 'all' ? 'No matching todos' : 'No todos yet'}
          description={
            query.search || query.status !== 'all'
              ? 'Try a different search or status filter.'
              : 'Create your first todo to get started.'
          }
          action={
            <Button onClick={openCreate}>
              New todo
            </Button>
          }
        />
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="list-status" aria-live="polite">
            {isFetching && !isPending ? <span className="muted">Updating…</span> : null}
          </div>
          <TodoList todos={data.items} />
          <PaginationBar
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </AppLayout>
  )
}
