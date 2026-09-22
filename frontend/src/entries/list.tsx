import { mountPage } from '@/app/bootstrap'
import { env } from '@/config/env'
import { TodoListPage } from '@/pages/TodoListPage'

document.title = `Todos · ${env.appName}`
mountPage(TodoListPage)
