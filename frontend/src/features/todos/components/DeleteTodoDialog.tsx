import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Todo } from '@/types/todo'

interface DeleteTodoDialogProps {
  todo: Todo
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteTodoDialog({ todo, isDeleting, onCancel, onConfirm }: DeleteTodoDialogProps) {
  return (
    <Modal title="Delete todo" onClose={onCancel}>
      <p>
        Delete <strong>{todo.title}</strong>? This cannot be undone.
      </p>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Modal>
  )
}
