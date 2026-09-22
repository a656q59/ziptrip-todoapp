"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function toBody(error) {
    return {
        message: error.message,
        code: error.code,
        status: error.status,
        ...(error.details !== undefined ? { details: error.details } : {}),
    };
}
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        status: 404,
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (error, req, res, _next) => {
    if (error instanceof errors_1.AppError) {
        if (error.status >= 500) {
            logger_1.logger.error({ err: error, path: req.path }, error.message);
        }
        else {
            logger_1.logger.warn({ err: error, path: req.path, code: error.code }, error.message);
        }
        res.status(error.status).json(toBody(error));
        return;
    }
    if (error instanceof SyntaxError && 'body' in error) {
        const badRequest = new errors_1.BadRequestError('Malformed JSON body', 'INVALID_JSON');
        res.status(badRequest.status).json(toBody(badRequest));
        return;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const conflict = new errors_1.ConflictError('A record with this unique value already exists', 'UNIQUE_CONSTRAINT');
        res.status(conflict.status).json(toBody(conflict));
        return;
    }
    logger_1.logger.error({ err: error, path: req.path }, 'Unhandled error');
    const message = env_1.env.NODE_ENV === 'production' ? 'Internal server error' : 'Internal server error';
    res.status(500).json({
        message,
        code: 'INTERNAL_ERROR',
        status: 500,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map