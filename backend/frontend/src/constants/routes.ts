export const ROUTES = {
  list: '/',
  todoDocument: '/todo',
} as const

export const LIST_RETURN_STORAGE_KEY = 'ziptrip.todos.returnUrl'

export function todoDetailsPath(id: string): string {
  return `${ROUTES.todoDocument}?id=${encodeURIComponent(id)}`
}

export function rememberListLocation(): void {
  const current = `${window.location.pathname}${window.location.search}`
  if (!current.startsWith('/todo')) {
    sessionStorage.setItem(LIST_RETURN_STORAGE_KEY, current === '/index.html' ? '/' : current)
  }
}

export function goToTodo(id: string): void {
  rememberListLocation()
  window.location.assign(todoDetailsPath(id))
}

export function goToList(): void {
  const stored = sessionStorage.getItem(LIST_RETURN_STORAGE_KEY)
  window.location.assign(stored && stored.length > 0 ? stored : ROUTES.list)
}
