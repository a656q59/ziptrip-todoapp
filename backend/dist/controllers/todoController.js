"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const todoValidators_1 = require("../validators/todoValidators");
class TodoController {
    todos;
    constructor(todos) {
        this.todos = todos;
    }
    list = async (req, res) => {
        const query = (0, todoValidators_1.parseTodoListQuery)(req.query);
        const result = await this.todos.list(query);
        res.status(200).json(result);
    };
    getById = async (req, res) => {
        const id = (0, todoValidators_1.parseTodoId)(req.params.id);
        const todo = await this.todos.getById(id);
        res.status(200).json(todo);
    };
    create = async (req, res) => {
        const input = (0, todoValidators_1.parseTodoWriteBody)(req.body);
        const todo = await this.todos.create(input);
        res.status(201).json(todo);
    };
    update = async (req, res) => {
        const id = (0, todoValidators_1.parseTodoId)(req.params.id);
        const input = (0, todoValidators_1.parseTodoWriteBody)(req.body);
        const todo = await this.todos.update(id, input);
        res.status(200).json(todo);
    };
    toggleComplete = async (req, res) => {
        const id = (0, todoValidators_1.parseTodoId)(req.params.id);
        const { completed } = (0, todoValidators_1.parseCompleteBody)(req.body);
        const todo = await this.todos.toggleComplete(id, completed);
        res.status(200).json(todo);
    };
    remove = async (req, res) => {
        const id = (0, todoValidators_1.parseTodoId)(req.params.id);
        await this.todos.remove(id);
        res.status(204).send();
    };
}
exports.TodoController = TodoController;
//# sourceMappingURL=todoController.js.map