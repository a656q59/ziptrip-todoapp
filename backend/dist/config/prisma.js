"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.ensureSessionUser = ensureSessionUser;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
exports.prisma = new client_1.PrismaClient({
    log: env_1.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
async function ensureSessionUser() {
    await exports.prisma.user.upsert({
        where: { id: env_1.env.SESSION_USER_ID },
        create: {
            id: env_1.env.SESSION_USER_ID,
            username: env_1.env.SESSION_USERNAME,
        },
        update: {
            username: env_1.env.SESSION_USERNAME,
        },
    });
}
//# sourceMappingURL=prisma.js.map