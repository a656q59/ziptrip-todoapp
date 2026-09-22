import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import {
  emptyTodoFormValues,
  formValuesToWriteInput,
  hasFormErrors,
  validateTodoForm,
  type TodoFormValues,
} from '@/features/todos/validation/todoValidation'
import { TODO_CATEGORIES, TODO_PRIORITIES, type Todo, type TodoWriteInput } from '@/types/todo'
import { DESCRIPTION_MAX_LENGTH, PRIORITY_LABELS, TITLE_MAX_LENGTH } from '@/constants/todo'
import { toDateInputValue } from '@/utils/formatDate'
import { tagsToInputValue } from '@/utils/tags'

interface TodoFormModalProps {
  mode: 'create' | 'edit'
  todo: Todo | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (input: TodoWriteInput) => Promise<void>
}

function valuesFromTodo(todo: Todo | null): TodoFormValues {
  if (!todo) {
    return emptyTodoFormValues()
  }

  return {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    category: todo.category,
    tags: tagsToInputValue(todo.tags),
    dueDate: toDateInputValue(todo.dueDate),
    completed: todo.completed,
  }
}

export function TodoFormModal({ mode, todo, isSaving, onClose, onSubmit }: TodoFormModalProps) {
  const [values, setValues] = useState<TodoFormValues>(() => valuesFromTodo(todo))
  const [errors, setErrors] = useState(validateTodoForm(valuesFromTodo(todo)))
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setValues(valuesFromTodo(todo))
    setErrors({})
    setSubmitted(false)
  }, [todo, mode])

  const update = <K extends keyof TodoFormValues>(key: K, value: TodoFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateTodoForm(values)
    setSubmitted(true)
    setErrors(nextErrors)
    if (hasFormErrors(nextErrors)) {
      return
    }
    await onSubmit(formValuesToWriteInput(values))
  }

  const shown = submitted ? errors : {}

  return (
    <Modal title={mode === 'edit' ? 'Edit todo' : 'New todo'} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <Input
          label="Title"
          name="title"
          value={values.title}
          maxLength={TITLE_MAX_LENGTH}
          required
          error={shown.title}
          onChange={(event) => update('title', event.target.value)}
        />
        <Textarea
          label="Description"
          name="description"
          rows={4}
          maxLength={DESCRIPTION_MAX_LENGTH}
          value={values.description}
          error={shown.description}
          onChange={(event) => update('description', event.target.value)}
        />
        <div className="form-row">
          <Select
            label="Priority"
            name="priority"
            value={values.priority}
            error={shown.priority}
            onChange={(event) => update('priority', event.target.value)}
          >
            {TODO_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Select>
          <Select
            label="Category"
            name="category"
            value={values.category}
            error={shown.category}
            onChange={(event) => update('category', event.target.value)}
          >
            {TODO_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label="Tags"
          name="tags"
          value={values.tags}
          placeholder="Comma-separated, e.g. api, frontend"
          onChange={(event) => update('tags', event.target.value)}
        />
        <Input
          label="Due date"
          name="dueDate"
          type="date"
          value={values.dueDate}
          error={shown.dueDate}
          onChange={(event) => update('dueDate', event.target.value)}
        />
        {mode === 'edit' ? (
          <label className="check-field">
            <input
              type="checkbox"
              checked={values.completed}
              onChange={(event) => update('completed', event.target.checked)}
            />
            Completed
          </label>
        ) : null}
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create todo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
