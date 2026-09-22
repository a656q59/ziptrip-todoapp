"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
class TodoService {
    todos;
    session;
    constructor(todos, session = {
        id: env_1.env.SESSION_USER_ID,
        username: env_1.env.SESSION_USERNAME,
    }) {
        this.todos = todos;
        this.session = session;
    }
    list(query) {
        return this.todos.list(query);
    }
    async getById(id) {
        const todo = await this.todos.findById(id);
        if (!todo) {
            throw new errors_1.NotFoundError();
        }
        return todo;
    }
    create(input) {
        return this.todos.create({
            title: input.title,
            description: input.description,
            completed: Boolean(input.completed),
            priority: input.priority,
            category: input.category,
            tags: input.tags,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            user: this.session,
        });
    }
    async update(id, input) {
        const todo = await this.todos.update(id, {
            title: input.title,
            description: input.description,
            priority: input.priority,
            category: input.category,
            tags: input.tags,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            completed: input.completed,
        });
        if (!todo) {
            throw new errors_1.NotFoundError();
        }
        return todo;
    }
    async toggleComplete(id, completed) {
        const todo = await this.todos.toggleComplete(id, completed);
        if (!todo) {
            throw new errors_1.NotFoundError();
        }
        return todo;
    }
    async remove(id) {
        const deleted = await this.todos.delete(id);
        if (!deleted) {
            throw new errors_1.NotFoundError();
        }
    }
}
exports.TodoService = TodoService;
//# sourceMappingURL=todoService.js.map