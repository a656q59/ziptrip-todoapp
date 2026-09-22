import type { Request, Response } from 'express'
import type { TodoService } from '../services/todoService'
import {
  parseCompleteBody,
  parseTodoId,
  parseTodoListQuery,
  parseTodoWriteBody,
} from '../validators/todoValidators'

export class TodoController {
  constructor(private readonly todos: TodoService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = parseTodoListQuery(req.query)
    const result = await this.todos.list(query)
    res.status(200).json(result)
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseTodoId(req.params.id)
    const todo = await this.todos.getById(id)
    res.status(200).json(todo)
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const input = parseTodoWriteBody(req.body)
    const todo = await this.todos.create(input)
    res.status(201).json(todo)
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseTodoId(req.params.id)
    const input = parseTodoWriteBody(req.body)
    const todo = await this.todos.update(id, input)
    res.status(200).json(todo)
  }

  toggleComplete = async (req: Request, res: Response): Promise<void> => {
    const id = parseTodoId(req.params.id)
    const { completed } = parseCompleteBody(req.body)
    const todo = await this.todos.toggleComplete(id, completed)
    res.status(200).json(todo)
  }

  remove = async (req: Request, res: Response): Promise<void> => {
    const id = parseTodoId(req.params.id)
    await this.todos.remove(id)
    res.status(204).send()
  }
}
