"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const logger_1 = require("./utils/logger");
async function start() {
    await prisma_1.prisma.$connect();
    await (0, prisma_1.ensureSessionUser)();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.PORT, () => {
        logger_1.logger.info({ port: env_1.env.PORT, env: env_1.env.NODE_ENV }, 'API listening');
    });
    const shutdown = async (signal) => {
        logger_1.logger.info({ signal }, 'Shutting down');
        server.close(async () => {
            await prisma_1.prisma.$disconnect();
            process.exit(0);
        });
    };
    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}
start().catch(async (error) => {
    logger_1.logger.fatal({ err: error }, 'Failed to start server');
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=server.js.map