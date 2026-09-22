import { useEffect } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/EmptyState'
import { Spinner } from '@/components/feedback/Spinner'
import { TodoDetailView } from '@/features/todos/components/TodoDetailView'
import { useTodoQuery } from '@/features/todos/hooks/useTodoQuery'
import { useQueryParam } from '@/hooks/useQueryParam'
import { env } from '@/config/env'
import { goToList } from '@/constants/routes'
import { isApiError } from '@/services/api/errors'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function TodoDetailPage() {
  const id = useQueryParam('id')
  const { data, isPending, isError, error, refetch } = useTodoQuery(id)

  useEffect(() => {
    if (data) {
      document.title = `${data.title} · ${env.appName}`
    } else {
      document.title = `Todo details · ${env.appName}`
    }
  }, [data])

  return (
    <AppLayout title="Todo details" subtitle="This document is loaded independently from the list page." showHeading={!data}>
      {!id ? (
        <EmptyState
          title="Missing todo ID"
          description="Open a todo from the list, or add an id query parameter such as /todo?id=todo-101."
          action={
            <Button variant="secondary" onClick={goToList}>
              Back to list
            </Button>
          }
        />
      ) : null}

      {id && isPending ? <Spinner label="Loading todo" /> : null}

      {id && isError && isApiError(error) && error.status === 404 ? (
        <EmptyState
          title="Todo not found"
          description="No todo matches this ID. It may have been deleted, or the link is invalid."
          action={
            <Button variant="secondary" onClick={goToList}>
              Back to list
            </Button>
          }
        />
      ) : null}

      {id && isError && !(isApiError(error) && error.status === 404) ? (
        <ErrorState title="Unable to load todo" message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : null}

      {data ? <TodoDetailView todo={data} /> : null}
    </AppLayout>
  )
}
