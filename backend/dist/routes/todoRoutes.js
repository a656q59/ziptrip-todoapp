"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoRouter = createTodoRouter;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
function createTodoRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/', (0, asyncHandler_1.asyncHandler)(controller.list));
    router.post('/', (0, asyncHandler_1.asyncHandler)(controller.create));
    router.get('/:id', (0, asyncHandler_1.asyncHandler)(controller.getById));
    router.patch('/:id/complete', (0, asyncHandler_1.asyncHandler)(controller.toggleComplete));
    router.patch('/:id', (0, asyncHandler_1.asyncHandler)(controller.update));
    router.delete('/:id', (0, asyncHandler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=todoRoutes.js.map