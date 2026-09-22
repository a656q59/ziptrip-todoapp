# API

Base URL: `http://localhost:4000/api`

All successful JSON responses are the resource itself (a `Todo` or `TodoListResult`). Errors always include `message`, `code`, and `status`. The frontend reads `message`.

Dates are ISO-8601 strings. `dueDate` may be `null`. `DELETE` returns `204` with an empty body.

## Todo resource

```json
{
  "id": "todo-101",
  "title": "Prepare ZipTrip interview demo",
  "description": "Polish the todo application…",
  "completed": false,
  "priority": "urgent",
  "category": "Work",
  "tags": ["interview", "frontend"],
  "userId": "user-42",
  "username": "deepu",
  "createdAt": "2026-09-20T09:00:00.000Z",
  "updatedAt": "2026-09-20T09:00:00.000Z",
  "dueDate": "2026-09-22T12:00:00.000Z"
}
```

**priority:** `low` | `medium` | `high` | `urgent`  
**category:** `Work` | `Personal` | `Health` | `Learning` | `Home` | `Other`

---

## GET /todos

Paginated list used by the list page.

### Query parameters

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer ≥ 1 | `1` | Clamped to the last page when too high |
| `pageSize` | integer 1–50 | `8` | Frontend sends `8` |
| `q` | string | `""` | Case-insensitive search across title, description, category, username, and tags |
| `status` | `all` \| `active` \| `completed` | `all` | `active` = incomplete |
| `sort` | `createdAt` \| `updatedAt` \| `dueDate` \| `priority` \| `title` | `createdAt` | Priority uses rank low→urgent |
| `dir` | `asc` \| `desc` | `desc` | Missing due dates sort last when `asc`, first when `desc` |

`counts` are global (not filtered by `q` or `status`).

### Response `200`

```json
{
  "items": [],
  "total": 18,
  "page": 1,
  "pageSize": 8,
  "totalPages": 3,
  "counts": {
    "all": 18,
    "active": 14,
    "completed": 4
  }
}
```

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `INVALID_QUERY` | Invalid `page`, `status`, `sort`, `dir`, or `pageSize` |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## GET /todos/:id

Used by the details page (`/todo?id=<id>`).

### Response `200`

A `Todo` object.

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `TODO_ID_REQUIRED` | Empty or invalid id |
| 404 | `TODO_NOT_FOUND` | No row for that id |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## POST /todos

Create a todo. Owner is the configured session user (`SESSION_USER_ID` / `SESSION_USERNAME`).

### Request body

```json
{
  "title": "Ship the API layer",
  "description": "Match the frontend contract",
  "priority": "urgent",
  "category": "Work",
  "tags": ["backend"],
  "dueDate": "2026-09-25T12:00:00.000Z",
  "completed": false
}
```

| Field | Rules |
| --- | --- |
| `title` | Required, trimmed, 3–120 characters |
| `description` | Optional string, max 2000, trimmed |
| `priority` | One of the priority enum values |
| `category` | One of the category enum values |
| `tags` | Array of strings, max 8, each truncated to 24 characters, blanks removed |
| `dueDate` | ISO-8601 string or `null` |
| `completed` | Optional boolean, default `false` |

### Response `201`

The created `Todo`.

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `INVALID_JSON` | Malformed JSON |
| 409 | `UNIQUE_CONSTRAINT` | Unique constraint conflict |
| 422 | `VALIDATION_ERROR` | Body fails field rules |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## PATCH /todos/:id

Replace editable fields. `completed` is optional; if omitted, the current value is kept.

### Request body

Same shape as `POST /todos`.

### Response `200`

The updated `Todo`.

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `TODO_ID_REQUIRED` / `INVALID_JSON` | Bad id or JSON |
| 404 | `TODO_NOT_FOUND` | Unknown id |
| 409 | `UNIQUE_CONSTRAINT` | Unique constraint conflict |
| 422 | `VALIDATION_ERROR` | Body fails field rules |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## PATCH /todos/:id/complete

Toggle complete from the list and details actions.

### Request body

```json
{
  "completed": true
}
```

### Response `200`

The updated `Todo`.

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `TODO_ID_REQUIRED` / `INVALID_JSON` | Bad id or JSON |
| 404 | `TODO_NOT_FOUND` | Unknown id |
| 422 | `VALIDATION_ERROR` | `completed` missing or not a boolean |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## DELETE /todos/:id

### Response `204`

Empty body.

### Errors

| Status | Code | When |
| --- | --- | --- |
| 400 | `TODO_ID_REQUIRED` | Invalid id |
| 404 | `TODO_NOT_FOUND` | Unknown id |
| 500 | `INTERNAL_ERROR` | Unexpected failure |

---

## GET /health

Liveness probe (not used by the UI).

### Response `200`

```json
{ "status": "ok" }
```

---

## Error envelope

```json
{
  "message": "Todo not found",
  "code": "TODO_NOT_FOUND",
  "status": 404,
  "details": {
    "fieldErrors": {
      "title": "Title is required."
    }
  }
}
```

`details` is present only when field-level validation failed. Stack traces are never returned.
