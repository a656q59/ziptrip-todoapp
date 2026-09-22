"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaError = mapPrismaError;
const client_1 = require("@prisma/client");
const errors_1 = require("./errors");
function mapPrismaError(error) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            throw new errors_1.ConflictError('A record with this unique value already exists', 'UNIQUE_CONSTRAINT');
        }
        if (error.code === 'P2025') {
            return;
        }
    }
    throw error;
}
//# sourceMappingURL=prismaErrors.js.map