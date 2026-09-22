"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.loadEnv = loadEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    CORS_ORIGIN: zod_1.z.string().url().default('http://localhost:5173'),
    SESSION_USER_ID: zod_1.z.string().min(1).default('user-42'),
    SESSION_USERNAME: zod_1.z.string().min(1).default('alex.morgan'),
});
function loadEnv(source = process.env) {
    const parsed = envSchema.safeParse(source);
    if (!parsed.success) {
        const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
        throw new Error(`Invalid environment configuration: ${details}`);
    }
    return parsed.data;
}
exports.env = loadEnv();
//# sourceMappingURL=env.js.map