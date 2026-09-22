import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={cn('badge', `badge-${tone}`)}>{children}</span>
}
