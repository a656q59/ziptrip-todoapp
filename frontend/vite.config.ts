import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function rewriteTodoDocument(): Plugin {
  const rewrite = (url?: string) => {
    if (!url) {
      return url
    }

    const [pathname, search] = url.split('?')
    const query = search ? `?${search}` : ''
    const isTodoDocument =
      pathname === '/todo' ||
      pathname === '/todo/' ||
      pathname === '/todo.html'

    return isTodoDocument ? `/todo.html${query}` : url
  }

  const apply = (req: { url?: string }) => {
    req.url = rewrite(req.url) ?? req.url
  }

  return {
    name: 'mpa-todo-document-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        apply(req)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        apply(req)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), rewriteTodoDocument()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, 'index.html'),
        todo: path.resolve(rootDir, 'todo.html'),
      },
    },
  },
})
