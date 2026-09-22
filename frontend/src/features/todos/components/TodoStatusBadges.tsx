import { PRIORITY_LABELS } from '@/constants/todo'
import { Badge } from '@/components/ui/Badge'
import type { Todo, TodoPriority } from '@/types/todo'
import { isOverdue } from '@/utils/formatDate'

const PRIORITY_TONE: Record<TodoPriority, 'neutral' | 'info' | 'warning' | 'danger'> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

export function TodoStatusBadges({ todo }: { todo: Todo }) {
  return (
    <div className="badge-row">
      <Badge tone={todo.completed ? 'success' : 'info'}>{todo.completed ? 'Completed' : 'Active'}</Badge>
      <Badge tone={PRIORITY_TONE[todo.priority]}>{PRIORITY_LABELS[todo.priority]}</Badge>
      <Badge>{todo.category}</Badge>
      {isOverdue(todo.dueDate, todo.completed) ? <Badge tone="danger">Overdue</Badge> : null}
    </div>
  )
}
