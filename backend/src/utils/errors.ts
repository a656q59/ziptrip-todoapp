export class AppError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, message: string, code: string, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code = 'BAD_REQUEST', details?: unknown) {
    super(400, message, code, details)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Todo not found', code = 'TODO_NOT_FOUND') {
    super(404, message, code)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT', details?: unknown) {
    super(409, message, code, details)
    this.name = 'ConflictError'
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, details?: unknown) {
    super(422, message, 'VALIDATION_ERROR', details)
    this.name = 'UnprocessableEntityError'
  }
}
