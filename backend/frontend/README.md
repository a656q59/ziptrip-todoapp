# ZipTrip Todos (Frontend)

Production-oriented React + TypeScript todo application built as a **multiple-page application (MPA)** with Vite. Data fetching, loading, error, and pagination states are handled with TanStack Query. Shared UI state (theme, session, toasts, todo editor/delete dialogs) uses React Context so pages stay free of prop drilling and Redux.

The UI talks to a `TodoRepository` interface implemented by `HttpTodoRepository`, which calls the Node.js + PostgreSQL API.

## Features

- Independent **Todos list** and **Todo details** documents
- Create, edit, delete, and toggle complete/incomplete
- Search, status filters (All / Active / Completed), sort, and pagination
- Confirmation for destructive deletes
- Loading, empty, not-found, and API error states
- Accessible forms, dialogs, focus styles, and skip link
- Light/dark theme persisted locally
- Realistic todo metadata (priority, category, tags, owner, timestamps, due date)

## Tech stack

- React 19 + TypeScript
- Vite (multi-page build)
- TanStack Query
- React Context
- CSS design tokens (no CSS-in-JS)

React Router is **not** used. Page changes are real document navigations (`/` and `/todo?id=123`), which matches the MPA requirement.

## Architecture

Each HTML file is its own document and React root:

| Document | URL | Entry | Page |
| --- | --- | --- | --- |
| List | `/` | `src/entries/list.tsx` | `TodoListPage` |
| Details | `/todo?id=<todoId>` | `src/entries/detail.tsx` | `TodoDetailPage` |

Shared code (providers, layout, components, hooks, repository, validation) is imported by both entries. UI components never call `fetch` directly.

```
HTML document
  → entry (list | detail)
    → AppProviders (QueryClient, Theme, Session, Toast, Todo actions)
      → page
        → feature hooks → TodoRepository → HTTP API
```

### Key decisions

1. **MPA via Vite multi-page input**, not a client-side router tree inside one root.
2. **TanStack Query** owns server state, retries, cache, and paginated list queries (`placeholderData: keepPreviousData`).
3. **Context API** owns cross-cutting UI state only.
4. **Dependency inversion:** `TodoRepository` is the only data-access contract. `HttpTodoRepository` calls `VITE_API_BASE_URL`.
5. **List filters live in the URL** so refresh and “back to list” keep search/sort/page.

## Folder structure

```
src/
  app/              Shared bootstrap + providers for every document
  entries/          MPA entrypoints (one per HTML file)
  pages/            Document-level screens
  layouts/          Shell, header, skip link
  features/todos/   Todo UI, hooks, validation, query keys
  components/       Reusable UI and feedback primitives
  context/          Theme, session, toasts
  services/         HTTP client and repository
  hooks/            Generic hooks (debounce, query params)
  types/            Domain types
  constants/        Routes and todo limits
  config/           Environment parsing
  utils/            Formatting, errors, URL query helpers
  styles/           Design system
```

## Install

```bash
npm install
```

## Run locally

Start the backend first, then:

```bash
npm run dev
```

Then open:

- List: http://localhost:5173/
- Details example: http://localhost:5173/todo?id=todo-101

Vite rewrites `/todo` to `todo.html` in both `dev` and `preview`. Static hosts need the same rewrite (`/todo` → `/todo.html`) after `npm run build`.

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_APP_NAME` | Header and document titles |
| `VITE_API_BASE_URL` | Backend API base, e.g. `http://localhost:4000/api` |

Never put secrets in Vite `VITE_*` variables; they are exposed to the browser.

The UI expects these REST endpoints:

- `GET /todos` (query: `page`, `pageSize`, `q`, `status`, `sort`, `dir`)
- `GET /todos/:id`
- `POST /todos`
- `PATCH /todos/:id`
- `PATCH /todos/:id/complete`
- `DELETE /todos/:id`

Keep response shapes aligned with `Todo` and `TodoListResult` in `src/types/todo.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite MPA dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
