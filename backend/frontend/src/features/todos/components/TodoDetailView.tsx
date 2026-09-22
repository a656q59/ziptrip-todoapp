import { Button } from '@/components/ui/Button'
import { goToList } from '@/constants/routes'
import { TodoStatusBadges } from '@/features/todos/components/TodoStatusBadges'
import { useTodoActions } from '@/features/todos/context/TodoActionsContext'
import type { Todo } from '@/types/todo'
import { formatDateTime } from '@/utils/formatDate'

export function TodoDetailView({ todo }: { todo: Todo }) {
  const { openEdit, requestDelete, toggleComplete, isToggling } = useTodoActions()

  return (
    <article className="detail-card">
      <header className="detail-header">
        <div>
          <p className="eyebrow">Todo {todo.id}</p>
          <h1>{todo.title}</h1>
          <TodoStatusBadges todo={todo} />
        </div>
        <div className="todo-actions">
          <Button variant="secondary" onClick={goToList}>
            Back to list
          </Button>
          <Button variant="ghost" onClick={() => toggleComplete(todo)} disabled={isToggling(todo.id)}>
            {todo.completed ? 'Mark active' : 'Mark complete'}
          </Button>
          <Button variant="ghost" onClick={() => openEdit(todo)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => requestDelete(todo)}>
            Delete
          </Button>
        </div>
      </header>
      <p className="detail-description">{todo.description || 'No description provided.'}</p>
      <dl className="detail-grid">
        <div>
          <dt>Status</dt>
          <dd>{todo.completed ? 'Completed' : 'Active'}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd className="capitalize">{todo.priority}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{todo.category}</dd>
        </div>
        <div>
          <dt>Tags</dt>
          <dd>{todo.tags.length > 0 ? todo.tags.join(', ') : '—'}</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{formatDateTime(todo.dueDate)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDateTime(todo.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDateTime(todo.updatedAt)}</dd>
        </div>
        <div>
          <dt>Username</dt>
          <dd>{todo.username}</dd>
        </div>
        <div>
          <dt>User ID</dt>
          <dd>
            <code>{todo.userId}</code>
          </dd>
        </div>
      </dl>
    </article>
  )
}
