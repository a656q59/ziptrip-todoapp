import { z, ZodError } from 'zod'
import {
  DESCRIPTION_MAX_LENGTH,
  MAX_PAGE_SIZE,
  TAG_MAX_COUNT,
  TAG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  TODO_CATEGORIES,
  TODO_PRIORITIES,
} from '../config/constants'
import { BadRequestError, UnprocessableEntityError } from '../utils/errors'
import type { TodoListQuery, TodoWriteInput } from '../types/todo'

const todoIdSchema = z
  .string()
  .trim()
  .min(1, 'Todo id is required')
  .max(64, 'Todo id is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Todo id is invalid')

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(8),
  q: z.string().max(200).optional().default(''),
  status: z.enum(['all', 'active', 'completed']).default('all'),
  sort: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  dir: z.enum(['asc', 'desc']).default('desc'),
})

const tagsSchema = z
  .array(z.string())
  .max(TAG_MAX_COUNT, `Use at most ${TAG_MAX_COUNT} tags.`)
  .transform((tags) => normalizeTags(tags))

const writeBodySchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(1, 'Title is required.')
        .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters.`)
        .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`),
    ),
  description: z
    .string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`)
    .transform((value) => value.trim())
    .default(''),
  priority: z.enum(TODO_PRIORITIES, { errorMap: () => ({ message: 'Choose a valid priority.' }) }),
  category: z.enum(TODO_CATEGORIES, { errorMap: () => ({ message: 'Choose a valid category.' }) }),
  tags: tagsSchema.default([]),
  dueDate: z.union([z.string(), z.null()]).optional().default(null),
  completed: z.boolean().optional(),
})

const completeBodySchema = z.object({
  completed: z.boolean({ required_error: 'completed is required.', invalid_type_error: 'completed must be a boolean.' }),
})

export function normalizeTags(raw: string[]): string[] {
  const unique = new Set<string>()

  for (const part of raw) {
    const tag = part.trim().replace(/\s+/g, ' ')
    if (tag.length === 0) {
      continue
    }
    unique.add(tag.slice(0, TAG_MAX_LENGTH))
    if (unique.size >= TAG_MAX_COUNT) {
      break
    }
  }

  return [...unique]
}

function fieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0] ? String(issue.path[0]) : 'request'
    if (!result[key]) {
      result[key] = issue.message
    }
  }
  return result
}

function firstMessage(error: ZodError, fallback: string): string {
  return error.issues[0]?.message ?? fallback
}

export function parseTodoId(id: unknown): string {
  const parsed = todoIdSchema.safeParse(id)
  if (!parsed.success) {
    throw new BadRequestError(firstMessage(parsed.error, 'Todo id is required'), 'TODO_ID_REQUIRED', {
      fieldErrors: fieldErrors(parsed.error),
    })
  }
  return parsed.data
}

export function parseTodoListQuery(query: unknown): TodoListQuery {
  const parsed = listQuerySchema.safeParse(query)
  if (!parsed.success) {
    throw new BadRequestError(firstMessage(parsed.error, 'Invalid list query'), 'INVALID_QUERY', {
      fieldErrors: fieldErrors(parsed.error),
    })
  }

  return {
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    search: parsed.data.q.trim(),
    status: parsed.data.status,
    sort: parsed.data.sort,
    direction: parsed.data.dir,
  }
}

function parseDueDate(value: string | null): string | null {
  if (value === null || value.trim() === '') {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new UnprocessableEntityError('Enter a valid due date.', { fieldErrors: { dueDate: 'Enter a valid due date.' } })
  }

  return date.toISOString()
}

export function parseTodoWriteBody(body: unknown): TodoWriteInput {
  const parsed = writeBodySchema.safeParse(body)
  if (!parsed.success) {
    throw new UnprocessableEntityError(firstMessage(parsed.error, 'Validation failed'), {
      fieldErrors: fieldErrors(parsed.error),
    })
  }

  return {
    title: parsed.data.title,
    description: parsed.data.description,
    priority: parsed.data.priority,
    category: parsed.data.category,
    tags: parsed.data.tags,
    dueDate: parseDueDate(parsed.data.dueDate),
    completed: parsed.data.completed,
  }
}

export function parseCompleteBody(body: unknown): { completed: boolean } {
  const parsed = completeBodySchema.safeParse(body)
  if (!parsed.success) {
    throw new UnprocessableEntityError(firstMessage(parsed.error, 'completed must be a boolean.'), {
      fieldErrors: fieldErrors(parsed.error),
    })
  }
  return parsed.data
}
