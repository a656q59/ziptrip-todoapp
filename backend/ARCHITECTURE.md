# Architecture

The backend is a small Express service with a layered structure. Each layer has one job so HTTP, validation, business rules, and SQL stay separate.

```
src/
├── config/         Environment, Prisma client, domain constants
├── controllers/    Map HTTP requests to service calls and status codes
├── routes/         URL wiring only
├── services/       Use-case logic (not-found, session owner, field mapping)
├── repositories/   PostgreSQL access through Prisma
├── middleware/     CORS is configured in app.ts; logging and error handling live here
├── validators/     Zod schemas for query, params, and bodies
├── types/          Todo DTOs that match the frontend
├── utils/          Errors, logger, async handler, Prisma error mapping, DTO mapping
├── app.ts          Composition root: middleware + wiring + routes
└── server.ts       Process bootstrap, shutdown, session-user upsert
```

## Responsibilities

| Layer | Allowed to do | Must not do |
| --- | --- | --- |
| Routes | Bind method + path to a controller | Parse bodies, query the database |
| Controllers | Read `req`, call validators and the service, write `res` | Embed SQL or filtering rules |
| Validators | Reject invalid input with 400/422 | Persist data |
| Services | Orchestrate use cases, throw domain errors | Talk to Express or Prisma directly |
| Repositories | Queries, transactions, indexes usage | Set HTTP status codes |
| Middleware | Logging, 404 fall-through, error serialization | Todo business rules |

## Data model

Aligned with the frontend `Todo` type:

- `User` — `id`, `username`. The session owner (`SESSION_USER_ID` / `SESSION_USERNAME`) is upserted on API startup.
- `Todo` — title, description, completed, priority, denormalized `priorityRank` (for sort), category, due date, timestamps, owner
- `Tag` — name per todo, unique `(todoId, name)`, cascaded on delete

Indexes cover id lookup, status (`completed`), sort columns (`createdAt`, `updatedAt`, `dueDate`, `title`, `priorityRank`), owner, category, and tag name search.

## Request path

1. Helmet sets security headers; CORS allows `CORS_ORIGIN` only.
2. JSON bodies are capped at 32kb. Invalid JSON becomes `400 INVALID_JSON`.
3. `GET /api/todos` validates query aliases used by the frontend (`q`, `dir`).
4. List filtering/sorting/pagination runs in the repository so PostgreSQL does the work. Counts for All/Active/Completed are global (not scoped to the current search).
5. Failures funnel through `errorHandler`. `AppError` subclasses set 400, 404, 409, and 422. Anything else is `500` with a generic message.

## Frontend contract

`frontend/src/services/todos/httpTodoRepository.ts` is the source of truth for URLs and payloads. This service does not add extra resources (comments, auth, attachments) because the UI does not use them.
