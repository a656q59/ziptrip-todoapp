"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    details;
    constructor(status, message, code, details) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message, code = 'BAD_REQUEST', details) {
        super(400, message, code, details);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends AppError {
    constructor(message = 'Todo not found', code = 'TODO_NOT_FOUND') {
        super(404, message, code);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message, code = 'CONFLICT', details) {
        super(409, message, code, details);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends AppError {
    constructor(message, details) {
        super(422, message, 'VALIDATION_ERROR', details);
        this.name = 'UnprocessableEntityError';
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
//# sourceMappingURL=errors.js.map