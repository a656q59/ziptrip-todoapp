"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTags = normalizeTags;
exports.parseTodoId = parseTodoId;
exports.parseTodoListQuery = parseTodoListQuery;
exports.parseTodoWriteBody = parseTodoWriteBody;
exports.parseCompleteBody = parseCompleteBody;
const zod_1 = require("zod");
const constants_1 = require("../config/constants");
const errors_1 = require("../utils/errors");
const todoIdSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'Todo id is required')
    .max(64, 'Todo id is too long')
    .regex(/^[A-Za-z0-9_-]+$/, 'Todo id is invalid');
const listQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(constants_1.MAX_PAGE_SIZE).default(8),
    q: zod_1.z.string().max(200).optional().default(''),
    status: zod_1.z.enum(['all', 'active', 'completed']).default('all'),
    sort: zod_1.z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
    dir: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
const tagsSchema = zod_1.z
    .array(zod_1.z.string())
    .max(constants_1.TAG_MAX_COUNT, `Use at most ${constants_1.TAG_MAX_COUNT} tags.`)
    .transform((tags) => normalizeTags(tags));
const writeBodySchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: 'Title is required.' })
        .transform((value) => value.trim())
        .pipe(zod_1.z
        .string()
        .min(1, 'Title is required.')
        .min(constants_1.TITLE_MIN_LENGTH, `Title must be at least ${constants_1.TITLE_MIN_LENGTH} characters.`)
        .max(constants_1.TITLE_MAX_LENGTH, `Title must be ${constants_1.TITLE_MAX_LENGTH} characters or fewer.`)),
    description: zod_1.z
        .string()
        .max(constants_1.DESCRIPTION_MAX_LENGTH, `Description must be ${constants_1.DESCRIPTION_MAX_LENGTH} characters or fewer.`)
        .transform((value) => value.trim())
        .default(''),
    priority: zod_1.z.enum(constants_1.TODO_PRIORITIES, { errorMap: () => ({ message: 'Choose a valid priority.' }) }),
    category: zod_1.z.enum(constants_1.TODO_CATEGORIES, { errorMap: () => ({ message: 'Choose a valid category.' }) }),
    tags: tagsSchema.default([]),
    dueDate: zod_1.z.union([zod_1.z.string(), zod_1.z.null()]).optional().default(null),
    completed: zod_1.z.boolean().optional(),
});
const completeBodySchema = zod_1.z.object({
    completed: zod_1.z.boolean({ required_error: 'completed is required.', invalid_type_error: 'completed must be a boolean.' }),
});
function normalizeTags(raw) {
    const unique = new Set();
    for (const part of raw) {
        const tag = part.trim().replace(/\s+/g, ' ');
        if (tag.length === 0) {
            continue;
        }
        unique.add(tag.slice(0, constants_1.TAG_MAX_LENGTH));
        if (unique.size >= constants_1.TAG_MAX_COUNT) {
            break;
        }
    }
    return [...unique];
}
function fieldErrors(error) {
    const result = {};
    for (const issue of error.issues) {
        const key = issue.path[0] ? String(issue.path[0]) : 'request';
        if (!result[key]) {
            result[key] = issue.message;
        }
    }
    return result;
}
function firstMessage(error, fallback) {
    return error.issues[0]?.message ?? fallback;
}
function parseTodoId(id) {
    const parsed = todoIdSchema.safeParse(id);
    if (!parsed.success) {
        throw new errors_1.BadRequestError(firstMessage(parsed.error, 'Todo id is required'), 'TODO_ID_REQUIRED', {
            fieldErrors: fieldErrors(parsed.error),
        });
    }
    return parsed.data;
}
function parseTodoListQuery(query) {
    const parsed = listQuerySchema.safeParse(query);
    if (!parsed.success) {
        throw new errors_1.BadRequestError(firstMessage(parsed.error, 'Invalid list query'), 'INVALID_QUERY', {
            fieldErrors: fieldErrors(parsed.error),
        });
    }
    return {
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
        search: parsed.data.q.trim(),
        status: parsed.data.status,
        sort: parsed.data.sort,
        direction: parsed.data.dir,
    };
}
function parseDueDate(value) {
    if (value === null || value.trim() === '') {
        return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new errors_1.UnprocessableEntityError('Enter a valid due date.', { fieldErrors: { dueDate: 'Enter a valid due date.' } });
    }
    return date.toISOString();
}
function parseTodoWriteBody(body) {
    const parsed = writeBodySchema.safeParse(body);
    if (!parsed.success) {
        throw new errors_1.UnprocessableEntityError(firstMessage(parsed.error, 'Validation failed'), {
            fieldErrors: fieldErrors(parsed.error),
        });
    }
    return {
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        category: parsed.data.category,
        tags: parsed.data.tags,
        dueDate: parseDueDate(parsed.data.dueDate),
        completed: parsed.data.completed,
    };
}
function parseCompleteBody(body) {
    const parsed = completeBodySchema.safeParse(body);
    if (!parsed.success) {
        throw new errors_1.UnprocessableEntityError(firstMessage(parsed.error, 'completed must be a boolean.'), {
            fieldErrors: fieldErrors(parsed.error),
        });
    }
    return parsed.data;
}
//# sourceMappingURL=todoValidators.js.map