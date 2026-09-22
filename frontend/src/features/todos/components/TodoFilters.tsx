import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'
import { PRIORITY_LABELS } from '@/constants/todo'
import type { TodoListQuery, TodoListResult, TodoSortField, TodoStatusFilter } from '@/types/todo'
import { TODO_SORT_FIELDS, TODO_STATUS_FILTERS } from '@/types/todo'

interface TodoFiltersProps {
  query: TodoListQuery
  searchDraft: string
  counts?: TodoListResult['counts']
  onSearchChange: (value: string) => void
  onStatusChange: (value: TodoStatusFilter) => void
  onSortChange: (value: TodoSortField) => void
  onDirectionChange: (value: TodoListQuery['direction']) => void
}

const SORT_LABELS: Record<TodoSortField, string> = {
  createdAt: 'Created',
  updatedAt: 'Updated',
  dueDate: 'Due date',
  priority: 'Priority',
  title: 'Title',
}

export function TodoFilters({
  query,
  searchDraft,
  counts,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onDirectionChange,
}: TodoFiltersProps) {
  return (
    <div className="filters">
      <Input
        label="Search todos"
        type="search"
        name="q"
        placeholder="Search by title, description, tag, or owner"
        value={searchDraft}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="filter-tabs" role="tablist" aria-label="Filter by status">
        {TODO_STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={query.status === status}
            className={cn('filter-tab', query.status === status && 'is-active')}
            onClick={() => onStatusChange(status)}
          >
            {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Completed'}
            {counts ? <span className="count">{counts[status]}</span> : null}
          </button>
        ))}
      </div>
      <div className="filter-sorts">
        <Select label="Sort by" value={query.sort} onChange={(event) => onSortChange(event.target.value as TodoSortField)}>
          {TODO_SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field === 'priority' ? `${SORT_LABELS[field]} (${PRIORITY_LABELS.urgent} first when descending)` : SORT_LABELS[field]}
            </option>
          ))}
        </Select>
        <Select
          label="Direction"
          value={query.direction}
          onChange={(event) => onDirectionChange(event.target.value as TodoListQuery['direction'])}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
      </div>
    </div>
  )
}
