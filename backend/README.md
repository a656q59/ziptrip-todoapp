# ZipTrip Todos — Backend

REST API for the ZipTrip Todos frontend. It implements only the operations the UI already uses: list (search, status, sort, pagination), details by ID, create, update, toggle complete, and delete.

## Tech stack

- Node.js 20+
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod validation

## Architecture

HTTP flow:

```
Route → Controller → Validator → Service → Repository → PostgreSQL
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder responsibilities and [API.md](./API.md) for every endpoint.

The JSON shapes match `frontend/src/types/todo.ts` (`Todo`, `TodoWriteInput`, `TodoListResult`) so `HttpTodoRepository` can call this service without adapter code.

## Prerequisites

- Node.js 20 or newer
- npm
- Docker or a local PostgreSQL 16 instance (DBeaver can be used as the SQL client)

## Environment variables

Copy `.env.example` to `.env` and adjust if needed. Never commit `.env`.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | HTTP port (default `4000`) |
| `LOG_LEVEL` | Pino log level (`info`, `debug`, `silent`, …) |
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `CORS_ORIGIN` | Comma-separated browser origins. In development, `localhost` and `127.0.0.1` on any port are also allowed. |
| `SESSION_USER_ID` | Owner id stamped on created todos (`user-42`, same as the frontend session) |
| `SESSION_USERNAME` | Owner username stamped on created todos (`deepu`) |

The frontend does not send auth tokens. New todos are owned by the configured session user.

## Database setup

PostgreSQL must already be running (local install or `docker compose up -d`). DBeaver is only a client; it does not start the server.

### Create the database in DBeaver

1. **Database → New Database Connection → PostgreSQL**
2. Connect to the default admin database:
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username / password: your PostgreSQL superuser (often `postgres`)
3. Test Connection → Finish
4. Open a SQL editor on that connection and run:

```sql
CREATE USER ziptrip WITH PASSWORD 'ziptrip';
CREATE DATABASE ziptrip_todos OWNER ziptrip;
```

5. Create a second connection (or edit this one) pointed at the app database:
   - Host: `localhost`
   - Port: `5432`
   - Database: `ziptrip_todos`
   - Username: `ziptrip`
   - Password: `ziptrip`

If a user or database already exists, skip that `CREATE` statement.

Set `DATABASE_URL` in `.env` to:

```
DATABASE_URL=postgresql://ziptrip:ziptrip@localhost:5432/ziptrip_todos?schema=public
```

Then apply schema and users from the `backend` folder (not from DBeaver):

```bash
npm run prisma:generate
npm run db:setup
```

Refresh the `ziptrip_todos` connection in DBeaver. You should see `User`, `Todo`, and `Tag`. The session owner is created automatically when the API starts.

### Docker alternative

Start PostgreSQL with Docker (same user, password, database, and port as above):

```bash
docker compose up -d
```

Then run `npm run prisma:generate` and `npm run db:setup` as above.

For local schema iteration:

```bash
npm run prisma:generate
npm run db:setup
```

For local schema iteration:

```bash
npm run prisma:migrate
```

## Install and run

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:setup
npm run dev
```

- API base: http://localhost:4000/api
- Health: http://localhost:4000/health
- List: http://localhost:4000/api/todos
- Details: http://localhost:4000/api/todos/:id

Production:

```bash
npm run build
npm start
```

`npm start` expects `prisma migrate deploy` to have been applied against the production database.

## Connect the frontend

In `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart Vite. The UI uses:

- `GET /todos` with `page`, `pageSize`, `q`, `status`, `sort`, `dir`
- `GET /todos/:id`
- `POST /todos`
- `PATCH /todos/:id`
- `PATCH /todos/:id/complete`
- `DELETE /todos/:id`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | TypeScript watch server (`tsx`) |
| `npm run build` | Generate Prisma client and compile to `dist/` |
| `npm start` | Run the compiled production server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm run prisma:migrate:deploy` | Apply committed migrations |
| `npm run db:setup` | Deploy committed migrations |
