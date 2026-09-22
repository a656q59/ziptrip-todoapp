import type { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import { PRIORITY_RANK, TODO_CATEGORIES } from '../config/constants'
import type {
  Todo,
  TodoCreateRecord,
  TodoListQuery,
  TodoListResult,
  TodoUpdateRecord,
} from '../types/todo'
import { toTodoDto, type TodoRecord } from '../utils/todoMapper'
import { mapPrismaError } from '../utils/prismaErrors'

const todoInclude = {
  tags: { orderBy: { name: 'asc' as const } },
  user: { select: { id: true, username: true } },
} satisfies Prisma.TodoInclude

export interface TodoRepository {
  list(query: TodoListQuery): Promise<TodoListResult>
  findById(id: string): Promise<Todo | null>
  create(input: TodoCreateRecord): Promise<Todo>
  update(id: string, input: TodoUpdateRecord): Promise<Todo | null>
  toggleComplete(id: string, completed: boolean): Promise<Todo | null>
  delete(id: string): Promise<boolean>
}

function buildSearchWhere(search: string): Prisma.TodoWhereInput | undefined {
  const needle = search.trim()
  if (!needle) {
    return undefined
  }

  const matchingCategories = TODO_CATEGORIES.filter((category) =>
    category.toLowerCase().includes(needle.toLowerCase()),
  )

  return {
    OR: [
      { title: { contains: needle, mode: 'insensitive' } },
      { description: { contains: needle, mode: 'insensitive' } },
      { user: { username: { contains: needle, mode: 'insensitive' } } },
      ...(matchingCategories.length > 0 ? [{ category: { in: matchingCategories } }] : []),
      { tags: { some: { name: { contains: needle, mode: 'insensitive' } } } },
    ],
  }
}

function buildStatusWhere(status: TodoListQuery['status']): Prisma.TodoWhereInput | undefined {
  if (status === 'active') {
    return { completed: false }
  }
  if (status === 'completed') {
    return { completed: true }
  }
  return undefined
}

function buildOrderBy(query: TodoListQuery): Prisma.TodoOrderByWithRelationInput {
  if (query.sort === 'priority') {
    return { priorityRank: query.direction }
  }
  if (query.sort === 'dueDate') {
    return {
      dueDate: {
        sort: query.direction,
        nulls: query.direction === 'asc' ? 'last' : 'first',
      },
    }
  }
  if (query.sort === 'title') {
    return { title: query.direction }
  }
  if (query.sort === 'updatedAt') {
    return { updatedAt: query.direction }
  }
  return { createdAt: query.direction }
}

export class PrismaTodoRepository implements TodoRepository {
  async list(query: TodoListQuery): Promise<TodoListResult> {
    const where: Prisma.TodoWhereInput = {
      AND: [buildStatusWhere(query.status), buildSearchWhere(query.search)].filter(
        (clause): clause is Prisma.TodoWhereInput => Boolean(clause),
      ),
    }

    const [total, counts, grouped] = await Promise.all([
      prisma.todo.count({ where }),
      prisma.todo.count(),
      prisma.todo.groupBy({
        by: ['completed'],
        _count: { _all: true },
      }),
    ])

    const completedCount = grouped.find((row) => row.completed)?._count._all ?? 0
    const activeCount = grouped.find((row) => !row.completed)?._count._all ?? 0
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize))
    const page = Math.min(query.page, totalPages)
    const skip = (page - 1) * query.pageSize

    const rows = await prisma.todo.findMany({
      where,
      include: todoInclude,
      orderBy: buildOrderBy(query),
      skip,
      take: query.pageSize,
    })

    return {
      items: rows.map((row) => toTodoDto(row as TodoRecord)),
      total,
      page,
      pageSize: query.pageSize,
      totalPages,
      counts: {
        all: counts,
        active: activeCount,
        completed: completedCount,
      },
    }
  }

  async findById(id: string): Promise<Todo | null> {
    const row = await prisma.todo.findUnique({
      where: { id },
      include: todoInclude,
    })
    return row ? toTodoDto(row) : null
  }

  async create(input: TodoCreateRecord): Promise<Todo> {
    try {
      const row = await prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
          priority: input.priority,
          priorityRank: PRIORITY_RANK[input.priority],
          category: input.category,
          dueDate: input.dueDate,
          userId: input.user.id,
          tags: {
            create: input.tags.map((name) => ({ name })),
          },
        },
        include: todoInclude,
      })
      return toTodoDto(row)
    } catch (error) {
      mapPrismaError(error)
      throw error
    }
  }

  async update(id: string, input: TodoUpdateRecord): Promise<Todo | null> {
    try {
      const existing = await prisma.todo.findUnique({ where: { id } })
      if (!existing) {
        return null
      }

      const row = await prisma.$transaction(async (tx) => {
        await tx.tag.deleteMany({ where: { todoId: id } })
        return tx.todo.update({
          where: { id },
          data: {
            title: input.title,
            description: input.description,
            priority: input.priority,
            priorityRank: PRIORITY_RANK[input.priority],
            category: input.category,
            dueDate: input.dueDate,
            completed: input.completed ?? existing.completed,
            tags: {
              create: input.tags.map((name) => ({ name })),
            },
          },
          include: todoInclude,
        })
      })

      return toTodoDto(row)
    } catch (error) {
      mapPrismaError(error)
      throw error
    }
  }

  async toggleComplete(id: string, completed: boolean): Promise<Todo | null> {
    try {
      const existing = await prisma.todo.findUnique({ where: { id } })
      if (!existing) {
        return null
      }

      const row = await prisma.todo.update({
        where: { id },
        data: { completed },
        include: todoInclude,
      })
      return toTodoDto(row)
    } catch (error) {
      mapPrismaError(error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await prisma.todo.deleteMany({ where: { id } })
      return result.count > 0
    } catch (error) {
      mapPrismaError(error)
      throw error
    }
  }
}
