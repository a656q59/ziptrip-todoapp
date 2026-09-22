const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

function toValidDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value: string | null | undefined): string {
  const date = toValidDate(value)
  return date ? dateTimeFormatter.format(date) : '—'
}

export function formatDate(value: string | null | undefined): string {
  const date = toValidDate(value)
  return date ? dateFormatter.format(date) : '—'
}

export function toDateInputValue(value: string | null | undefined): string {
  const date = toValidDate(value)
  if (!date) {
    return ''
  }
  return date.toISOString().slice(0, 10)
}

export function isOverdue(dueDate: string | null, completed: boolean, now = Date.now()): boolean {
  if (!dueDate || completed) {
    return false
  }
  const date = toValidDate(dueDate)
  return date ? date.getTime() < now : false
}
