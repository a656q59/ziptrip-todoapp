import { mountPage } from '@/app/bootstrap'
import { env } from '@/config/env'
import { TodoDetailPage } from '@/pages/TodoDetailPage'

document.title = `Todo details · ${env.appName}`
mountPage(TodoDetailPage)
