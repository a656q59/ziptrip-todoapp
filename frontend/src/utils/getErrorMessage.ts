import { isApiError } from '@/services/api/errors'

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.status === 404 || error.code === 'TODO_NOT_FOUND') {
      return 'This todo could not be found. It may have been deleted.'
    }
    if (error.status === 400) {
      return 'Please check the form and try again.'
    }
    if (error.status >= 500) {
      return 'The server is unavailable right now. Please try again shortly.'
    }
    return 'The request could not be completed. Please try again.'
  }

  return 'Something went wrong. Please try again.'
}
