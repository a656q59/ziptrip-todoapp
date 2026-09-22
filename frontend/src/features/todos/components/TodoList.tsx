import { TodoListItem } from '@/features/todos/components/TodoListItem'
import type { Todo } from '@/types/todo'

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
