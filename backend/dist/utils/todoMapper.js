"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTodoDto = toTodoDto;
function toTodoDto(todo) {
    return {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        priority: todo.priority,
        category: todo.category,
        tags: todo.tags.map((tag) => tag.name),
        userId: todo.userId,
        username: todo.user.username,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
        dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    };
}
//# sourceMappingURL=todoMapper.js.map