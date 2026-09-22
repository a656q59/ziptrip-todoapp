"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const todoRepository_1 = require("./repositories/todoRepository");
const todoService_1 = require("./services/todoService");
const todoController_1 = require("./controllers/todoController");
const todoRoutes_1 = require("./routes/todoRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
function createApp(dependencies = {}) {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Accept', 'Content-Type'],
        maxAge: 600,
    }));
    app.use(express_1.default.json({ limit: '32kb' }));
    app.use(requestLogger_1.requestLogger);
    const repository = dependencies.todoRepository ?? new todoRepository_1.PrismaTodoRepository();
    const service = new todoService_1.TodoService(repository);
    const controller = new todoController_1.TodoController(service);
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    app.use('/api/todos', (0, todoRoutes_1.createTodoRouter)(controller));
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map