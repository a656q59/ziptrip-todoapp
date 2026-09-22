import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/app/AppProviders'
import '@/styles/global.css'

export function mountPage(Page: ComponentType) {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element #root was not found.')
  }

  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <Page />
      </AppProviders>
    </StrictMode>,
  )
}
