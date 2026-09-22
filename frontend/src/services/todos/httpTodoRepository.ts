import { env } from '@/config/env'
import { ApiError } from '@/services/api/errors'
import type { TodoRepository } from '@/services/todos/todoRepository'
import type { Todo, TodoListQuery, TodoListResult, TodoWriteInput } from '@/types/todo'

function buildUrl(path: string, query?: Record<string, string | number>): string {
  const url = new URL(path.replace(/^\//, ''), `${env.apiBaseUrl.replace(/\/$/, '')}/`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function request<T>(path: string, init?: RequestInit, query?: Record<string, string | number>): Promise<T> {
  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(503, 'Unable to reach the API', 'NETWORK_ERROR')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : 'Request failed'
    throw new ApiError(response.status, message, response.status === 404 ? 'TODO_NOT_FOUND' : 'API_ERROR')
  }

  return payload as T
}

export class HttpTodoRepository implements TodoRepository {
  list(query: TodoListQuery): Promise<TodoListResult> {
    return request<TodoListResult>('/todos', undefined, {
      page: query.page,
      pageSize: query.pageSize,
      q: query.search,
      status: query.status,
      sort: query.sort,
      dir: query.direction,
    })
  }

  getById(id: string): Promise<Todo> {
    return request<Todo>(`/todos/${encodeURIComponent(id)}`)
  }

  create(input: TodoWriteInput): Promise<Todo> {
    return request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  update(id: string, input: TodoWriteInput): Promise<Todo> {
    return request<Todo>(`/todos/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  }

  toggleComplete(id: string, completed: boolean): Promise<Todo> {
    return request<Todo>(`/todos/${encodeURIComponent(id)}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    })
  }

  remove(id: string): Promise<void> {
    return request<void>(`/todos/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }
}
