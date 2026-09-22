export function useQueryParam(name: string): string | null {
  const params = new URLSearchParams(window.location.search)
  const value = params.get(name)
  return value && value.trim().length > 0 ? value.trim() : null
}
