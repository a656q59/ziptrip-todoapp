import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@/constants/todo'
import { TODO_CATEGORIES, TODO_PRIORITIES, type TodoWriteInput } from '@/types/todo'
import { parseTags } from '@/utils/tags'

export interface TodoFormValues {
  title: string
  description: string
  priority: string
  category: string
  tags: string
  dueDate: string
  completed: boolean
}

export type TodoFormErrors = Partial<Record<keyof TodoFormValues, string>>

export function emptyTodoFormValues(): TodoFormValues {
  return {
    title: '',
    description: '',
    priority: 'medium',
    category: 'Work',
    tags: '',
    dueDate: '',
    completed: false,
  }
}

export function validateTodoForm(values: TodoFormValues): TodoFormErrors {
  const errors: TodoFormErrors = {}
  const title = values.title.trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters.`
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }

  if (values.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }

  if (!(TODO_PRIORITIES as readonly string[]).includes(values.priority)) {
    errors.priority = 'Choose a valid priority.'
  }

  if (!(TODO_CATEGORIES as readonly string[]).includes(values.category)) {
    errors.category = 'Choose a valid category.'
  }

  if (values.dueDate && Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = 'Enter a valid due date.'
  }

  return errors
}

export function formValuesToWriteInput(values: TodoFormValues): TodoWriteInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    priority: values.priority as TodoWriteInput['priority'],
    category: values.category as TodoWriteInput['category'],
    tags: parseTags(values.tags),
    dueDate: values.dueDate ? new Date(`${values.dueDate}T12:00:00.000Z`).toISOString() : null,
    completed: values.completed,
  }
}

export function hasFormErrors(errors: TodoFormErrors): boolean {
  return Object.keys(errors).length > 0
}
