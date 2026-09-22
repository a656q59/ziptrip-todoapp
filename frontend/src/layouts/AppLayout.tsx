import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import { useSession } from '@/context/SessionContext'
import { useTheme } from '@/context/ThemeContext'
import { useTodoActions } from '@/features/todos/context/TodoActionsContext'

interface AppLayoutProps {
  title: string
  subtitle?: string
  showHeading?: boolean
  children: ReactNode
}

export function AppLayout({ title, subtitle, showHeading = true, children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useSession()
  const { openCreate } = useTodoActions()

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <a className="brand" href={ROUTES.list}>
          <span className="brand-mark" aria-hidden="true" />
          <span>
            <strong>{env.appName}</strong>
            <span className="brand-sub">Multiple-page workspace</span>
          </span>
        </a>
        <div className="header-actions">
          <p className="session-chip">
            Signed in as <strong>{user.username}</strong>
          </p>
          <Button variant="secondary" size="sm" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button size="sm" onClick={openCreate}>
            New todo
          </Button>
        </div>
      </header>
      <main id="main" className="app-main">
        {showHeading ? (
          <div className="page-heading">
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  )
}
