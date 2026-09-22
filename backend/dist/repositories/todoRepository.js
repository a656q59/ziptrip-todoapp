"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTodoRepository = void 0;
const prisma_1 = require("../config/prisma");
const constants_1 = require("../config/constants");
const todoMapper_1 = require("../utils/todoMapper");
const prismaErrors_1 = require("../utils/prismaErrors");
const todoInclude = {
    tags: { orderBy: { name: 'asc' } },
    user: { select: { id: true, username: true } },
};
function buildSearchWhere(search) {
    const needle = search.trim();
    if (!needle) {
        return undefined;
    }
    const matchingCategories = constants_1.TODO_CATEGORIES.filter((category) => category.toLowerCase().includes(needle.toLowerCase()));
    return {
        OR: [
            { title: { contains: needle, mode: 'insensitive' } },
            { description: { contains: needle, mode: 'insensitive' } },
            { user: { username: { contains: needle, mode: 'insensitive' } } },
            ...(matchingCategories.length > 0 ? [{ category: { in: matchingCategories } }] : []),
            { tags: { some: { name: { contains: needle, mode: 'insensitive' } } } },
        ],
    };
}
function buildStatusWhere(status) {
    if (status === 'active') {
        return { completed: false };
    }
    if (status === 'completed') {
        return { completed: true };
    }
    return undefined;
}
function buildOrderBy(query) {
    if (query.sort === 'priority') {
        return { priorityRank: query.direction };
    }
    if (query.sort === 'dueDate') {
        return {
            dueDate: {
                sort: query.direction,
                nulls: query.direction === 'asc' ? 'last' : 'first',
            },
        };
    }
    if (query.sort === 'title') {
        return { title: query.direction };
    }
    if (query.sort === 'updatedAt') {
        return { updatedAt: query.direction };
    }
    return { createdAt: query.direction };
}
class PrismaTodoRepository {
    async list(query) {
        const where = {
            AND: [buildStatusWhere(query.status), buildSearchWhere(query.search)].filter((clause) => Boolean(clause)),
        };
        const [total, counts, grouped] = await Promise.all([
            prisma_1.prisma.todo.count({ where }),
            prisma_1.prisma.todo.count(),
            prisma_1.prisma.todo.groupBy({
                by: ['completed'],
                _count: { _all: true },
            }),
        ]);
        const completedCount = grouped.find((row) => row.completed)?._count._all ?? 0;
        const activeCount = grouped.find((row) => !row.completed)?._count._all ?? 0;
        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const page = Math.min(query.page, totalPages);
        const skip = (page - 1) * query.pageSize;
        const rows = await prisma_1.prisma.todo.findMany({
            where,
            include: todoInclude,
            orderBy: buildOrderBy(query),
            skip,
            take: query.pageSize,
        });
        return {
            items: rows.map((row) => (0, todoMapper_1.toTodoDto)(row)),
            total,
            page,
            pageSize: query.pageSize,
            totalPages,
            counts: {
                all: counts,
                active: activeCount,
                completed: completedCount,
            },
        };
    }
    async findById(id) {
        const row = await prisma_1.prisma.todo.findUnique({
            where: { id },
            include: todoInclude,
        });
        return row ? (0, todoMapper_1.toTodoDto)(row) : null;
    }
    async create(input) {
        try {
            const row = await prisma_1.prisma.todo.create({
                data: {
                    title: input.title,
                    description: input.description,
                    completed: input.completed,
                    priority: input.priority,
                    priorityRank: constants_1.PRIORITY_RANK[input.priority],
                    category: input.category,
                    dueDate: input.dueDate,
                    userId: input.user.id,
                    tags: {
                        create: input.tags.map((name) => ({ name })),
                    },
                },
                include: todoInclude,
            });
            return (0, todoMapper_1.toTodoDto)(row);
        }
        catch (error) {
            (0, prismaErrors_1.mapPrismaError)(error);
            throw error;
        }
    }
    async update(id, input) {
        try {
            const existing = await prisma_1.prisma.todo.findUnique({ where: { id } });
            if (!existing) {
                return null;
            }
            const row = await prisma_1.prisma.$transaction(async (tx) => {
                await tx.tag.deleteMany({ where: { todoId: id } });
                return tx.todo.update({
                    where: { id },
                    data: {
                        title: input.title,
                        description: input.description,
                        priority: input.priority,
                        priorityRank: constants_1.PRIORITY_RANK[input.priority],
                        category: input.category,
                        dueDate: input.dueDate,
                        completed: input.completed ?? existing.completed,
                        tags: {
                            create: input.tags.map((name) => ({ name })),
                        },
                    },
                    include: todoInclude,
                });
            });
            return (0, todoMapper_1.toTodoDto)(row);
        }
        catch (error) {
            (0, prismaErrors_1.mapPrismaError)(error);
            throw error;
        }
    }
    async toggleComplete(id, completed) {
        try {
            const existing = await prisma_1.prisma.todo.findUnique({ where: { id } });
            if (!existing) {
                return null;
            }
            const row = await prisma_1.prisma.todo.update({
                where: { id },
                data: { completed },
                include: todoInclude,
            });
            return (0, todoMapper_1.toTodoDto)(row);
        }
        catch (error) {
            (0, prismaErrors_1.mapPrismaError)(error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await prisma_1.prisma.todo.deleteMany({ where: { id } });
            return result.count > 0;
        }
        catch (error) {
            (0, prismaErrors_1.mapPrismaError)(error);
            throw error;
        }
    }
}
exports.PrismaTodoRepository = PrismaTodoRepository;
//# sourceMappingURL=todoRepository.js.map