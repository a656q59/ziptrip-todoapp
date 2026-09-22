import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="state-panel">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Unable to load todos', message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-panel state-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
