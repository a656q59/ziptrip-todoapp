import { Button } from '@/components/ui/Button'
import { TodoStatusBadges } from '@/features/todos/components/TodoStatusBadges'
import { useTodoActions } from '@/features/todos/context/TodoActionsContext'
import { goToTodo, rememberListLocation, todoDetailsPath } from '@/constants/routes'
import type { Todo } from '@/types/todo'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

export function TodoListItem({ todo }: { todo: Todo }) {
  const { openEdit, requestDelete, toggleComplete, isToggling } = useTodoActions()
  const toggling = isToggling(todo.id)

  return (
    <li>
      <article className={cn('todo-item', todo.completed && 'is-completed')}>
        <label className="todo-check">
          <input
            type="checkbox"
            checked={todo.completed}
            disabled={toggling}
            onChange={() => toggleComplete(todo)}
            aria-label={`Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`}
          />
        </label>
        <div className="todo-body">
          <div className="todo-title-row">
            <h3>
              <a href={todoDetailsPath(todo.id)} onClick={rememberListLocation}>
                {todo.title}
              </a>
            </h3>
            <TodoStatusBadges todo={todo} />
          </div>
          {todo.description ? <p className="todo-description">{todo.description}</p> : null}
          <dl className="todo-meta">
            <div>
              <dt>Due</dt>
              <dd>{formatDate(todo.dueDate)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDateTime(todo.updatedAt)}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{todo.username}</dd>
            </div>
            {todo.tags.length > 0 ? (
              <div>
                <dt>Tags</dt>
                <dd>{todo.tags.join(', ')}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="todo-actions">
          <Button variant="secondary" size="sm" onClick={() => goToTodo(todo.id)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(todo)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => requestDelete(todo)}>
            Delete
          </Button>
        </div>
      </article>
    </li>
  )
}
